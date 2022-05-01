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
import { Likeable } from './interfaces/likeable.interface';
import { LikeableEntityType } from './enums/likeable-entity-type.enum';
import { UseGuards } from '@nestjs/common';
import { IsAuthenticatedGuard } from 'src/auth/guards/is-authenticated.guard';
import { UserDataloader } from 'src/user/dataloaders/user.dataloader';
import { Loader } from '@tracworx/nestjs-dataloader';
import { StoryDataloader } from 'src/story/dataloaders/story.dataloader';
import { CommentDataloader } from 'src/comment/dataloaders/comment.dataloader';

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
        user: currentUser._id,
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
        user: currentUser._id,
      }),
    };
  }

  @ResolveField()
  async user(
    @Parent() like: Like,
    @Loader(UserDataloader) userDataloader,
  ): Promise<User> {
    return userDataloader.load(String(like.user._id));
  }

  @ResolveField()
  async entity(
    @Parent() like: Like,
    @Loader(StoryDataloader) storyDataloader,
    @Loader(CommentDataloader) commentDataloader,
  ): Promise<Likeable> {
    let entity;
    switch (like.entityType) {
      case LikeableEntityType.Story:
        entity = await storyDataloader.load(String(like.entity._id));
        break;
      case LikeableEntityType.Comment:
        entity = await commentDataloader.load(String(like.entity._id));
        break;
    }

    entity.likeableEntityType = like.entityType;
    return entity;
  }
}
