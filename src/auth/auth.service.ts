import { ConflictException, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { LoginPayload } from './dto/login.payload';
import { RegisterPayload } from './dto/register.payload';
import * as bcrypt from 'bcrypt';
import { RegisterInput } from './dto/register.input';
import { User } from 'src/user/user.entity';
import { JwtPayload } from './dto/jwt.payload';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userService.findOne({ email });
    const isPasswordMatching = await bcrypt.compare(password, user.password);
    if (isPasswordMatching) {
      // strip out password
      user.password = undefined;
      return user;
    }
    return null;
  }

  async login(user: User): Promise<LoginPayload> {
    const payload: JwtPayload = { email: user.email, sub: user._id };
    return {
      token: this.jwtService.sign(payload),
      user,
    };
  }

  async register(registerInput: RegisterInput): Promise<RegisterPayload> {
    // check if user already exists
    const existingUser = await this.userService.findOne({
      email: registerInput.email,
    });
    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    // create user
    const encryptedPassword = await bcrypt.hash(registerInput.password, 10);
    const user = await this.userService.create({
      ...registerInput,
      password: encryptedPassword,
    });

    // login user
    return this.login(user);
  }
}
