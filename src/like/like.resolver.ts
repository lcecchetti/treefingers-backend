import {
  Resolver,
  Args,
  ResolveField,
  Parent,
  Mutation,
} from '@nestjs/graphql';
import { LikeService } from './like.service';
import { Like } from './like.entity';
import { User } from '../user/user.entity';
import { CurrentUser } from '../auth/dto/current-user.dto';
import { GetCurrentUser } from '../auth/decorators/get-current-user.decorator';
import { LikePayload } from './payloads/like.payload';
import { LikeInput } from './inputs/like.input';
import { DislikeInput } from './inputs/dislike.input';
import { DislikePayload } from './payloads/dislike.payload';
import { UseGuards } from '@nestjs/common';
import { IsAuthenticatedGuard } from '../auth/guards/is-authenticated.guard';
import { UserDataloader } from '../user/dataloaders/user.dataloader';
import { Loader } from '@tracworx/nestjs-dataloader';
import { CommentDataloader } from '../comment/dataloaders/comment.dataloader';
import { StoryDataloader } from '../story/dataloaders/story.dataloader';
import { Story } from '../story/story.entity';

@Resolver(() => Like)
export class LikeResolver {
  constructor(private likeService: LikeService) {}

  @Mutation(() => LikePayload)
  @UseGuards(IsAuthenticatedGuard)
  async like(
    @Args('input') input: LikeInput,
    @GetCurrentUser() currentUser: CurrentUser,
  ): Promise<LikePayload> {
    return {
      like: await this.likeService.like({
        ...input,
        user: currentUser.id,
      }),
    };
  }

  @Mutation(() => DislikePayload)
  @UseGuards(IsAuthenticatedGuard)
  async dislike(
    @Args('input') input: DislikeInput,
    @GetCurrentUser() currentUser: CurrentUser,
  ): Promise<DislikePayload> {
    return {
      like: await this.likeService.dislike({
        ...input,
        user: currentUser.id,
      }),
    };
  }

  @ResolveField()
  async user(
    @Parent() like: Like,
    @Loader(UserDataloader) userDataloader,
  ): Promise<User> {
    return userDataloader.load(like.user.id);
  }

  @ResolveField(() => Story, { nullable: true })
  async story(
    @Parent() like: Like,
    @Loader(StoryDataloader) storyDataloader,
  ): Promise<Story | null> {
    if (!like.story) {
      return null;
    }
    return storyDataloader.load(like.story.id);
  }

  @ResolveField(() => Comment, { nullable: true })
  async comment(
    @Parent() like: Like,
    @Loader(CommentDataloader) commentDataloader,
  ): Promise<Comment | null> {
    if (!like.comment) {
      return null;
    }
    return commentDataloader.load(like.comment.id);
  }
}
