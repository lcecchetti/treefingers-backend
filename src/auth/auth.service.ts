import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
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
import { Exception } from 'handlebars';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
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
    // get user
    const user = await this.userService.findOne({ email: { eq: email } });
    if (!user) {
      throw new NotFoundException('User does not exist');
    }

    // update user
    const changePasswordToken = this.generateRandomToken();
    await this.userService.edit(user._id, { changePasswordToken });

    let result: any = {};
    try {
      result = await this.mailerService.sendMail({
        to: email,
        subject: 'Forgot your password?',
        template: 'forgot-password',
        context: {
          resetLink:
            this.configService.get<string>('frontend.webUrl') +
            `/auth/change-password/${user._id}/${changePasswordToken}/`,
        },
      });
    } catch (e) {
      throw new Exception('An error occurred while sending email');
    }

    return {
      emailSent: !!result.accepted?.length,
    };
  }

  async changePassword({
    user,
    token,
    password,
  }: ChangePasswordInput): Promise<ChangePasswordPayload> {
    const userData = await this.userService.findById(user);
    if (userData.changePasswordToken !== token) {
      throw new UnauthorizedException(
        'You are not authorized to change this user password',
      );
    }

    const result = await this.userService.edit(user, {
      password: password,
      changePasswordToken: null,
    });

    return {
      passwordChanged: !!result?._id,
    };
  }

  generateRandomToken(length = 32): string {
    return crypto.randomBytes(length).toString('hex');
  }
}
