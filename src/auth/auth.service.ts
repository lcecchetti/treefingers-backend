import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/user.entity';
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

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private configService: ConfigService,
    private jwtService: JwtService,
    private mailerService: MailerService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userService.findOne({ email: { eq: email } });

    // user not found
    if (!user) {
      throw new NotFoundException('User or password are not valid.');
    }

    // user not active
    if (user && !user.isActive) {
      throw new UnauthorizedException(
        'Your account is not active yet, check your emails.',
      );
    }

    // wrong password
    const isPasswordMatching = await bcrypt.compare(password, user.password);
    if (!isPasswordMatching) {
      throw new UnauthorizedException('User or password are not valid.');
    }

    // strip out password
    user.password = undefined;

    return user;
  }

  async login(user: User): Promise<LoginPayload> {
    const payload: JwtPayload = {
      email: user.email,
      sub: user.id,
      username: user.username,
    };

    return {
      token: this.jwtService.sign(payload),
      currentUser: user,
    };
  }

  async register(data: RegisterDataInput): Promise<RegisterPayload> {
    // create user
    const user = await this.userService.create(data);

    // activate account token
    const token = this.jwtService.sign(
      { sub: user.id },
      { expiresIn: '1 day' },
    );

    // send activate account email
    try {
      await this.mailerService.sendMail({
        to: data.email,
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

    return {
      result: true,
    };
  }

  async forgotPassword({
    email,
  }: ForgotPasswordInput): Promise<ForgotPasswordPayload> {
    // get user
    const user = await this.userService.findOne({ email: { eq: email } });

    if (user) {
      // change password token
      const token = this.jwtService.sign(
        { sub: user.id, password: user.password },
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

    const user = await this.userService.findById(decodedToken.sub);

    // if password has changed already, link is expired
    if (user.password !== decodedToken.password) {
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

  async activateAccount({
    token,
  }: ActivateAccountInput): Promise<ActivateAccountPayload> {
    let decodedToken;
    try {
      decodedToken = this.jwtService.verify(token);
    } catch (e) {
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

    return {
      result: true,
    };
  }
}
