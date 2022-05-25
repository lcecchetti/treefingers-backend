import { UseGuards } from '@nestjs/common';
import {
  Args,
  Mutation,
  Parent,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Loader } from '@tracworx/nestjs-dataloader';
import { GetCurrentUser } from 'src/auth/decorators/get-current-user.decorator';
import { CurrentUser } from 'src/auth/dto/current-user.dto';
import { IsAuthenticatedGuard } from 'src/auth/guards/is-authenticated.guard';
import { UserDataloader } from 'src/user/dataloaders/user.dataloader';
import { User } from 'src/user/user.entity';
import { Followership } from './followership.entity';
import { FollowershipService } from './followership.service';
import { FollowInput } from './inputs/follow.input';
import { UnfollowInput } from './inputs/unfollow.input';
import { FollowPayload } from './payloads/follow.payload';
import { UnfollowPayload } from './payloads/unfollow.payload';

@Resolver(() => Followership)
export class FollowershipResolver {
  constructor(private followershipService: FollowershipService) {}

  @Mutation(() => FollowPayload)
  @UseGuards(IsAuthenticatedGuard)
  async follow(
    @Args('input') input: FollowInput,
    @GetCurrentUser() currentUser: CurrentUser,
  ): Promise<FollowPayload> {
    return {
      followership: await this.followershipService.follow({
        ...input,
        follower: currentUser.id,
      }),
    };
  }

  @Mutation(() => UnfollowPayload)
  @UseGuards(IsAuthenticatedGuard)
  async unfollow(
    @Args('input') input: UnfollowInput,
    @GetCurrentUser() currentUser: CurrentUser,
  ): Promise<UnfollowPayload> {
    return {
      followership: await this.followershipService.unfollow({
        ...input,
        follower: currentUser.id,
      }),
    };
  }

  @ResolveField()
  async followed(
    @Parent() followership: Followership,
    @Loader(UserDataloader) userDataloader,
  ): Promise<User> {
    return userDataloader.load(followership.followed.id);
  }

  @ResolveField()
  async follower(
    @Parent() followership: Followership,
    @Loader(UserDataloader) userDataloader,
  ): Promise<User> {
    return userDataloader.load(followership.follower.id);
  }
}
