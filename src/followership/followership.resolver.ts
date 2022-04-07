import { UseGuards } from '@nestjs/common';
import {
  Args,
  Mutation,
  Parent,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { GetCurrentUser } from 'src/auth/decorators/get-current-user.decorator';
import { CurrentUser } from 'src/auth/dto/current-user.dto';
import { IsAuthenticatedGuard } from 'src/auth/guards/is-authenticated.guard';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { Followership } from './followership.entity';
import { FollowershipService } from './followership.service';
import { FollowInput } from './inputs/follow.input';
import { UnfollowInput } from './inputs/unfollow.input';
import { FollowPayload } from './payloads/follow.payload';
import { UnfollowPayload } from './payloads/unfollow.payload';

@Resolver(() => Followership)
export class FollowershipResolver {
  constructor(
    private followershipService: FollowershipService,
    private userService: UserService,
  ) {}

  @Mutation(() => FollowPayload)
  @UseGuards(IsAuthenticatedGuard)
  async follow(
    @Args('input') input: FollowInput,
    @GetCurrentUser() currentUser: CurrentUser,
  ): Promise<FollowPayload> {
    return {
      followership: await this.followershipService.follow(
        input,
        currentUser._id,
      ),
    };
  }

  @Mutation(() => UnfollowPayload)
  @UseGuards(IsAuthenticatedGuard)
  async unfollow(
    @Args('input') input: UnfollowInput,
    @GetCurrentUser() currentUser: CurrentUser,
  ): Promise<UnfollowPayload> {
    return {
      followership: await this.followershipService.unfollow(
        input,
        currentUser._id,
      ),
    };
  }

  @ResolveField()
  async user(@Parent() followership: Followership): Promise<User> {
    return this.userService.findById(followership.user._id);
  }

  @ResolveField()
  async follower(@Parent() followership: Followership): Promise<User> {
    return this.userService.findById(followership.follower._id);
  }
}
