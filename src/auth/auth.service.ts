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

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
    private jwtService: JwtService,
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

  async encryptPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }
}
