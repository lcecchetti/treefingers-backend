import { UseGuards } from '@nestjs/common';
import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { LoginPayload, LoginInput } from './auth.dto';
import { CurrentUser } from '../user/current-user.decorator';
import { User } from 'src/user/user.entity';

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
}
