import { UseGuards } from '@nestjs/common';
import { Resolver, Mutation, Context } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Mutation(() => String)
  async login(@Context('user') user): Promise<any | undefined> {
    return this.authService.login(user);
  }
}
