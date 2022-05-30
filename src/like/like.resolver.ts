import {
  Resolver,
  Args,
  ResolveField,
  Parent,
  Mutation,
} from '@nestjs/graphql';
import { LikeService } from './like.service';
import { Like } from './like.entity';
import { User } from 'src/user/user.entity';
import { CurrentUser } from 'src/auth/dto/current-user.dto';
import { GetCurrentUser } from 'src/auth/decorators/get-current-user.decorator';
import { LikePayload } from './payloads/like.payload';
import { LikeInput } from './inputs/like.input';
import { DislikeInput } from './inputs/dislike.input';
import { DislikePayload } from './payloads/dislike.payload';
import { UseGuards } from '@nestjs/common';
import { IsAuthenticatedGuard } from 'src/auth/guards/is-authenticated.guard';
import { UserDataloader } from 'src/user/dataloaders/user.dataloader';
import { Loader } from '@tracworx/nestjs-dataloader';
import { CommentDataloader } from 'src/comment/dataloaders/comment.dataloader';
import { StoryDataloader } from 'src/story/dataloaders/story.dataloader';
import { Story } from 'src/story/story.entity';

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

  @ResolveField(() => Story)
  async story(
    @Parent() like: Like,
    @Loader(StoryDataloader) storyDataloader,
  ): Promise<Story> {
    if (!like.story) {
      return null;
    }
    return storyDataloader.load(like.story.id);
  }

  @ResolveField(() => Comment)
  async comment(
    @Parent() like: Like,
    @Loader(CommentDataloader) commentDataloader,
  ): Promise<Comment> {
    if (!like.comment) {
      return null;
    }
    return commentDataloader.load(like.comment.id);
  }
}
