import { UseGuards } from '@nestjs/common';
import { Resolver, Mutation, Args, Context } from '@nestjs/graphql';
import { Throttle } from '@nestjs/throttler';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { GqlThrottlerGuard } from '../common/guards/gql-throttler.guard';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { GetCurrentUser } from './decorators/get-current-user.decorator';
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
import { User } from '../user/user.entity';
import { ResendActivateAccountPayload } from './payloads/resend-activate-account.payload';
import { ResendActivateAccountInput } from './inputs/resend-activate-account.input';
import { LogoutPayload } from './payloads/logout.payload';
import { AUTH_COOKIE_NAME, getAuthCookieOptions } from './auth.constants';

@Resolver()
export class AuthResolver {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @Mutation(() => LoginPayload)
  @UseGuards(GqlThrottlerGuard, LocalAuthGuard)
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  async login(
    @GetCurrentUser() user: User,
    @Args('input') input: LoginInput,
    @Context('res') res: Response,
  ): Promise<LoginPayload> {
    const payload = await this.authService.login(user);

    res.cookie(
      AUTH_COOKIE_NAME,
      payload.token,
      getAuthCookieOptions(
        this.configService.get<boolean>('env.isDev', false),
        this.configService.get<number>('jwt.cookieMaxAge'),
      ),
    );

    return payload;
  }

  @Mutation(() => LogoutPayload)
  async logout(@Context('res') res: Response): Promise<LogoutPayload> {
    res.clearCookie(
      AUTH_COOKIE_NAME,
      getAuthCookieOptions(this.configService.get<boolean>('env.isDev', false)),
    );

    return { result: true };
  }

  @Mutation(() => ForgotPasswordPayload)
  @UseGuards(GqlThrottlerGuard)
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
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

  @Mutation(() => ResendActivateAccountPayload)
  @UseGuards(GqlThrottlerGuard)
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  async resendActivateAccount(
    @Args('input') input: ResendActivateAccountInput,
  ): Promise<ResendActivateAccountPayload> {
    return this.authService.resendActivateAccount(input);
  }

  @Mutation(() => RegisterPayload)
  @UseGuards(GqlThrottlerGuard)
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  async register(
    @Args('input') { data }: RegisterInput,
  ): Promise<RegisterPayload> {
    return this.authService.register(data);
  }
}
