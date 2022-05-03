import { UseGuards } from '@nestjs/common';
import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { GetCurrentUser } from 'src/auth/decorators/get-current-user.decorator';
import { CurrentUser } from './dto/current-user.dto';
import { LoginPayload } from './payloads/login.payload';
import { LoginInput } from './inputs/login.input';
import { RegisterPayload } from './payloads/register.payload';
import { RegisterInput } from './inputs/register.input';
import { ResetPassowrdPayload } from './payloads/forgot-password.payload';
import { ForgotPasswordInput } from './inputs/forgot-password.input';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => LoginPayload)
  @UseGuards(LocalAuthGuard)
  async login(
    @GetCurrentUser() currentUser: CurrentUser,
    @Args('input') input: LoginInput,
  ): Promise<LoginPayload> {
    return this.authService.login(currentUser);
  }

  @Mutation(() => ResetPassowrdPayload)
  async forgotPassword(
    @Args('input') input: ForgotPasswordInput,
  ): Promise<ResetPassowrdPayload> {
    return this.authService.resetPassowrd(input);
  }

  @Mutation(() => RegisterPayload)
  async register(
    @Args('input') { data }: RegisterInput,
  ): Promise<RegisterPayload> {
    return this.authService.register(data);
  }
}
