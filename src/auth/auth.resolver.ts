import { UseGuards } from '@nestjs/common';
import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { LoginInput } from './dto/login.input';
import { RegisterInput } from './dto/register.input';
import { User } from 'src/user/user.entity';
import { LoginPayload } from './dto/login.payload';
import { RegisterPayload } from './dto/register.payload';
import { CurrentUser } from 'src/user/decorators/current-user.decorator';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Mutation(() => LoginPayload)
  async login(
    @CurrentUser() user: User,
    @Args('input') input: LoginInput,
  ): Promise<LoginPayload> {
    return this.authService.login(user);
  }

  @Mutation(() => RegisterPayload)
  async register(
    @Args('input') input: RegisterInput,
  ): Promise<RegisterPayload> {
    return this.authService.register(input);
  }
}
