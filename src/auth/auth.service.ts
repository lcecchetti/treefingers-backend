import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/user.entity';
import { LoginPayload } from './payloads/login.payload';
import { JwtPayload } from './payloads/jwt.payload';
import { RegisterDataInput } from './inputs/register.input';
import { RegisterPayload } from './payloads/register.payload';
import { ForgotPasswordInput } from './inputs/forgot-password.input';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { ChangePasswordPayload } from './payloads/change-password.payload';
import { ChangePasswordInput } from './inputs/change-password.input';
import { ForgotPasswordPayload } from './payloads/forgot-password.payload';
import { ActivateAccountInput } from './inputs/activate-account.input';
import { ActivateAccountPayload } from './payloads/activate-account.payload';
import { NotificationService } from '../notification/notification.service';
import { NotificationType } from '../notification/enum/notification-type.enum';
import { UrlService } from '../common/services/url.service';
import { ResendActivateAccountPayload } from './payloads/resend-activate-account.payload';

// a valid-looking hash with no matching password, so bcrypt.compare takes the
// same time whether or not the email actually exists (avoids leaking account
// existence through response timing)
const DUMMY_PASSWORD_HASH = bcrypt.hashSync('not-a-real-password', 10);

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private configService: ConfigService,
    private jwtService: JwtService,
    private mailerService: MailerService,
    private notificationService: NotificationService,
    private urlService: UrlService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userService.findOne({ email: { eq: email } });

    // always run bcrypt.compare, even if there's no user to compare against,
    // so response time doesn't reveal whether the email exists
    const isPasswordMatching = await bcrypt.compare(
      password,
      user?.password ?? DUMMY_PASSWORD_HASH,
    );

    // no such user, wrong password, or banned: identical response either way
    if (!user || !isPasswordMatching || user.isBanned) {
      throw new UnauthorizedException('User or password are not valid.');
    }

    // only reveal "not active yet" once the password is confirmed correct
    if (!user.isActive) {
      throw new UnauthorizedException(
        'Your account is not active yet, check your emails.',
      );
    }

    return user;
  }

  async login(user: User): Promise<LoginPayload> {
    const payload: JwtPayload = {
      email: user.email,
      sub: user.id,
      username: user.username,
      type: 'access',
    };

    await this.userService.edit(user.id, { lastLogin: new Date() });

    return {
      token: this.jwtService.sign(payload),
      currentUser: user,
    };
  }

  async register(data: RegisterDataInput): Promise<RegisterPayload> {
    await this.userService.create(data);
    const result = await this.sendActivateAccountEmail(data.email);

    return {
      result,
    };
  }

  async forgotPassword({
    email,
  }: ForgotPasswordInput): Promise<ForgotPasswordPayload> {
    // get user
    const user = await this.userService.findOne({ email: { eq: email } });

    if (user && !user.isBanned) {
      // change password token
      const token = this.jwtService.sign(
        { sub: user.id, tokenVersion: user.tokenVersion, type: 'reset' },
        { expiresIn: 60 * 15 },
      );

      // send forgot password email
      try {
        await this.mailerService.sendMail({
          to: email,
          subject: 'Forgot your password?',
          template: 'forgot-password',
          context: {
            resetLink:
              this.configService.get<string>('frontend.webUrl') +
              `/auth/change-password/${token}/`,
          },
        });
      } catch (e) {
        throw new InternalServerErrorException(
          'An error occurred while sending email',
        );
      }
    }

    // always return true to avoid user enumeration
    return {
      result: true,
    };
  }

  async changePassword({
    token,
    password,
  }: ChangePasswordInput): Promise<ChangePasswordPayload> {
    let decodedToken;
    try {
      decodedToken = this.jwtService.verify(token);
    } catch (e) {
      throw new UnauthorizedException('This link has expired');
    }

    if (decodedToken.type !== 'reset') {
      throw new UnauthorizedException('This link has expired');
    }

    const user = await this.userService.findById(decodedToken.sub);

    // if password has changed already, link is expired
    if (user.tokenVersion !== decodedToken.tokenVersion) {
      throw new UnauthorizedException('This link has expired');
    }

    // change password
    await this.userService.edit(decodedToken.sub, {
      password: password,
    });

    return {
      result: true,
    };
  }

  async sendActivateAccountEmail(email: string): Promise<boolean> {
    const user = await this.userService.findOne({ email: { eq: email } });

    if (!user || user.isActive) {
      return false;
    }

    // activate account token
    const token = this.jwtService.sign(
      { sub: user.id, type: 'activate' },
      { expiresIn: '1 day' },
    );

    // send activate account email
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Activate your account',
        template: 'activate-account',
        context: {
          activateLink:
            this.configService.get<string>('frontend.webUrl') +
            `/auth/activate-account/${token}/`,
        },
      });
    } catch (e) {
      throw new InternalServerErrorException(
        'An error occurred while sending email',
      );
    }

    return true;
  }

  async resendActivateAccount({
    email,
  }): Promise<ResendActivateAccountPayload> {
    // always return true to not return any info about email
    await this.sendActivateAccountEmail(email);
    return {
      result: true,
    };
  }

  async activateAccount({
    token,
  }: ActivateAccountInput): Promise<ActivateAccountPayload> {
    let decodedToken;
    try {
      decodedToken = this.jwtService.verify(token);
    } catch (e) {
      throw new UnauthorizedException('This link has expired');
    }

    if (decodedToken.type !== 'activate') {
      throw new UnauthorizedException('This link has expired');
    }

    // get user
    const user = await this.userService.findById(decodedToken.sub);
    if (!user || user.isActive) {
      throw new NotFoundException(
        'This user does not exist or is already active',
      );
    }

    // activate user
    await this.userService.edit(decodedToken.sub, {
      isActive: true,
    });

    await this.notificationService.create(
      {
        type: NotificationType.ACTIVATE_ACCOUNT,
        user: user.id,
        link: this.urlService.getStoryNewUrl(),
        content: `Welcome ${user.username}! We can't wait to see the stories you have to tell!`,
      },
      true,
    );

    return {
      result: true,
    };
  }
}
