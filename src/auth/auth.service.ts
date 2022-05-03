import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/user.entity';
import { CurrentUser } from './dto/current-user.dto';
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
    const isPasswordMatching = await bcrypt.compare(password, user.password);
    if (isPasswordMatching) {
      // strip out password
      user.password = undefined;
      return user;
    }
    return null;
  }

  async login(currentUser: CurrentUser): Promise<LoginPayload> {
    const payload: JwtPayload = {
      email: currentUser.email,
      sub: currentUser._id,
      username: currentUser.username,
    };
    return {
      token: this.jwtService.sign(payload),
      currentUser,
    };
  }

  async register(data: RegisterDataInput): Promise<RegisterPayload> {
    // create user
    const user = await this.userService.register(data);

    // login user
    return this.login(user);
  }

  async forgotPassword({
    email,
  }: ForgotPasswordInput): Promise<ForgotPasswordPayload> {
    const user = await this.userService.findOne({ email: { eq: email } });

    if (user) {
      const token = this.jwtService.sign(
        { sub: user._id },
        { expiresIn: 60 * 15 },
      );

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
    }

    // always return true to avoid user enumeration
    return {
      emailSent: true,
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

    const result = await this.userService.edit(decodedToken.sub, {
      password: password,
    });

    return {
      passwordChanged: !!result?._id,
    };
  }
}
