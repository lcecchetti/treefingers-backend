import { UseGuards } from '@nestjs/common';
import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { GetCurrentUser } from 'src/auth/decorators/get-current-user.decorator';
import { LoginPayload } from './payloads/login.payload';
import { LoginInput } from './inputs/login.input';
import { RegisterPayload } from './payloads/register.payload';
import { RegisterInput } from './inputs/register.input';
import { ForgotPasswordInput } from './inputs/forgot-password.input';
import { ForgotPasswordPayload } from './payloads/forgot-password.payload';
import { ChangePasswordPayload } from './payloads/change-password.payload';
import { ChangePasswordInput } from './inputs/change-password.input';
import { ActivateAccountPayload } from './payloads/activate-account.payload';
import { ActivateAccountInput } from './inputs/activate-account.input';
import { User } from 'src/user/user.entity';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => LoginPayload)
  @UseGuards(LocalAuthGuard)
  async login(
    @GetCurrentUser() user: User,
    @Args('input') input: LoginInput,
  ): Promise<LoginPayload> {
    return this.authService.login(user);
  }

  @Mutation(() => ForgotPasswordPayload)
  async forgotPassword(
    @Args('input') input: ForgotPasswordInput,
  ): Promise<ForgotPasswordPayload> {
    return this.authService.forgotPassword(input);
  }

  @Mutation(() => ChangePasswordPayload)
  async changePassword(
    @Args('input') input: ChangePasswordInput,
  ): Promise<ChangePasswordPayload> {
    return this.authService.changePassword(input);
  }

  @Mutation(() => ActivateAccountPayload)
  async activateAccount(
    @Args('input') input: ActivateAccountInput,
  ): Promise<ActivateAccountPayload> {
    return this.authService.activateAccount(input);
  }

  @Mutation(() => RegisterPayload)
  async register(
    @Args('input') { data }: RegisterInput,
  ): Promise<RegisterPayload> {
    return this.authService.register(data);
  }
}
