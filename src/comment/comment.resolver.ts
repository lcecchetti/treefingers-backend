import {
  Resolver,
  Query,
  Args,
  ResolveField,
  Parent,
  Mutation,
  Int,
} from '@nestjs/graphql';
import { CommentService } from './comment.service';
import { Comment } from './comment.entity';
import { UserService } from 'src/user/user.service';
import { StoryService } from 'src/story/story.service';
import { User } from 'src/user/user.entity';
import { GetCurrentUser } from 'src/auth/decorators/get-current-user.decorator';
import { Story } from 'src/story/story.entity';
import { CommentConnectionArgs } from './args/comment-connection.args';
import { CurrentUser } from 'src/auth/dto/current-user.dto';
import { Like } from 'src/like/like.entity';
import { LikeService } from 'src/like/like.service';
import { CommentConnection } from './dto/comment-connection.dto';
import { FilterCommentInput } from './inputs/filter-comment.input';
import { CommentStoryPayload } from './payloads/comment-story.payload';
import { CommentStoryInput } from './inputs/comment-story.input';
import { CommentForestPayload } from './payloads/comment-forest.payload';
import { CommentForestInput } from './inputs/comment-forest.input';
import { Forest } from 'src/forest/forest.entity';
import { ForestService } from 'src/forest/forest.service';

@Resolver(() => Comment)
export class CommentResolver {
  constructor(
    private commentService: CommentService,
    private userService: UserService,
    private storyService: StoryService,
    private likeService: LikeService,
    private forestService: ForestService,
  ) {}

  @Query(() => CommentConnection)
  async comments(
    @Args({ nullable: true })
    args: CommentConnectionArgs = new CommentConnectionArgs(),
  ): Promise<CommentConnection> {
    return this.commentService.paginate(args);
  }

  @Query(() => Comment, { nullable: true })
  async comment(
    @Args('filter', { nullable: true })
    filter: FilterCommentInput,
  ): Promise<Comment> {
    return this.commentService.findOne(filter);
  }

  @Mutation(() => CommentStoryPayload)
  async commentStory(
    @Args('input') input: CommentStoryInput,
    @GetCurrentUser() currentUser: CurrentUser,
  ): Promise<CommentStoryPayload> {
    return {
      comment: await this.commentService.commentStory(input, currentUser._id),
    };
  }

  @Mutation(() => CommentForestPayload)
  async commentForest(
    @Args('input') input: CommentForestInput,
    @GetCurrentUser() currentUser: CurrentUser,
  ): Promise<CommentForestPayload> {
    return {
      comment: await this.commentService.commentForest(input, currentUser._id),
    };
  }

  @ResolveField(() => Like, { nullable: true })
  async currentUserLike(
    @GetCurrentUser() currentUser: CurrentUser,
    @Parent() comment: Comment,
  ): Promise<Like | null> {
    if (!currentUser) {
      return null;
    }

    return this.likeService.findOne({
      comment: { eq: comment._id },
      user: { eq: currentUser._id },
    });
  }

  @ResolveField(() => Int)
  async likesCount(@Parent() comment: Comment): Promise<number> {
    return this.likeService.count({ comment: { eq: comment._id } });
  }

  @ResolveField()
  async user(@Parent() comment: Comment): Promise<User> {
    return this.userService.findById(comment.user._id);
  }

  @ResolveField()
  async story(@Parent() comment: Comment): Promise<Story | null> {
    if (!comment.story) {
      return null;
    }

    return this.storyService.findById(comment.story._id);
  }

  @ResolveField()
  async forest(@Parent() comment: Comment): Promise<Forest | null> {
    if (!comment.forest) {
      return null;
    }

    return this.forestService.findById(comment.forest._id);
  }
}
