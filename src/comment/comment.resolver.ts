import {
  Resolver,
  Query,
  Args,
  ResolveField,
  Parent,
  Mutation,
} from '@nestjs/graphql';
import { CommentService } from './comment.service';
import { Comment } from './comment.entity';
import { User } from '../user/user.entity';
import { GetCurrentUser } from '../auth/decorators/get-current-user.decorator';
import { CommentConnectionArgs } from './args/comment-connection.args';
import { CurrentUser } from '../auth/dto/current-user.dto';
import { CommentConnection } from './dto/comment-connection.dto';
import { Like } from '../like/like.entity';
import { CommentInput } from './inputs/comment.input';
import { CommentPayload } from './payloads/comment.payload';
import { UseGuards } from '@nestjs/common';
import { IsAuthenticatedGuard } from '../auth/guards/is-authenticated.guard';
import { UserDataloader } from '../user/dataloaders/user.dataloader';
import { Loader } from '@tracworx/nestjs-dataloader';
import { ForestDataloader } from '../forest/dataloaders/forest.dataloader';
import { LikeDataloader } from '../like/dataloaders/like.dataloader';
import { StoryDataloader } from '../story/dataloaders/story.dataloader';
import { Story } from '../story/story.entity';
import { Forest } from '../forest/forest.entity';

@Resolver(() => Comment)
export class CommentResolver {
  constructor(private commentService: CommentService) {}

  @Query(() => CommentConnection)
  async comments(
    @Args()
    args: CommentConnectionArgs = new CommentConnectionArgs(),
  ): Promise<CommentConnection> {
    return this.commentService.paginate(args);
  }

  @Mutation(() => CommentPayload)
  @UseGuards(IsAuthenticatedGuard)
  async submitComment(
    @Args('input') { data }: CommentInput,
    @GetCurrentUser() currentUser: CurrentUser,
  ): Promise<CommentPayload> {
    return {
      comment: await this.commentService.create({
        ...data,
        user: currentUser.id,
      }),
    };
  }

  @ResolveField(() => Like, { nullable: true })
  async currentUserLike(
    @GetCurrentUser() currentUser: CurrentUser,
    @Parent() comment: Comment,
    @Loader(LikeDataloader) likeDataloader,
  ): Promise<Like | null> {
    if (!currentUser) {
      return null;
    }

    return likeDataloader.load({
      comment: comment.id,
      user: currentUser.id,
    });
  }

  @ResolveField()
  async user(
    @Parent() comment: Comment,
    @Loader(UserDataloader) userDataloader,
  ): Promise<User> {
    return userDataloader.load(comment.user.id);
  }

  @ResolveField(() => Story, { nullable: true })
  async story(
    @Parent() comment: Comment,
    @Loader(StoryDataloader) storyDataloader,
  ): Promise<Story> {
    if (!comment.story) {
      return null;
    }
    return storyDataloader.load(comment.story.id);
  }

  @ResolveField(() => Forest, { nullable: true })
  async forest(
    @Parent() comment: Comment,
    @Loader(ForestDataloader) forestDataloader,
  ): Promise<Story> {
    if (!comment.forest) {
      return null;
    }
    return forestDataloader.load(comment.forest.id);
  }
}
