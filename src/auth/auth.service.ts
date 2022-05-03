import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/user.entity';
import { CurrentUser } from './dto/current-user.dto';
import { LoginPayload } from './payloads/login.payload';
import { JwtPayload } from './payloads/jwt.payload';
import { RegisterDataInput } from './inputs/register.input';
import { RegisterPayload } from './payloads/register.payload';
import { ResetPassowrdPayload } from './payloads/forgot-password.payload';
import { ForgotPasswordInput } from './inputs/forgot-password.input';
import { MailerService } from '@nestjs-modules/mailer';
import { Exception } from 'handlebars';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

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

  async resetPassowrd({
    email,
  }: ForgotPasswordInput): Promise<ResetPassowrdPayload> {
    let result: any = {};
    try {
      result = await this.mailerService.sendMail({
        to: email,
        subject: 'Forgot your password?',
        template: 'forgot-password',
        context: {
          resetLink: this.configService.get<string>('frontend.webUrl'),
        },
      });
    } catch (e) {
      throw new Exception('An error occurred while sending email');
    }

    return {
      emailSent: !!result.accepted?.length,
    };
  }
}
