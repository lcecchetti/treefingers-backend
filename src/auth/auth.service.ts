import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/user/user.entity';
import { CurrentUser } from './dto/current-user.dto';
import { LoginPayload } from './payloads/login.payload';
import { JwtPayload } from './payloads/jwt.payload';
import { RegisterDataInput } from './inputs/register.input';
import { RegisterPayload } from './payloads/register.payload';
import { RecoverPassowrdPayload } from './payloads/recover-password.payload';
import { RecoverPasswordInput } from './inputs/recover-password.input';
import { MailerService } from '@nestjs-modules/mailer';
import { Exception } from 'handlebars';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
    private configService: ConfigService,
    private jwtService: JwtService,
    private readonly mailerService: MailerService,
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
    const encryptedPassword = await this.encryptPassword(data.password);
    const user = await this.userService.register({
      ...data,
      password: encryptedPassword,
    });

    // login user
    return this.login(user);
  }

  async recoverPassowrd({
    email,
  }: RecoverPasswordInput): Promise<RecoverPassowrdPayload> {
    let result: any = {};
    try {
      result = await this.mailerService.sendMail({
        to: email,
        subject: 'Recover your password',
        template: 'recover-password',
        context: {
          recoverLink: this.configService.get<string>('frontend.webUrl'),
        },
      });
    } catch (e) {
      throw new Exception('An error occurred while sending email');
    }

    return {
      emailSent: !!result.accepted?.length,
    };
  }

  async encryptPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }
}
