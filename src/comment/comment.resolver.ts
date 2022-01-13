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
import { UserService } from 'src/user/user.service';
import { StoryService } from 'src/story/story.service';
import { User } from 'src/user/user.entity';
import { CreateCommentPayload } from './dto/create-comment.payload';
import { CreateCommentInput } from './dto/create-comment.input';
import { GetCurrentUser } from 'src/auth/decorators/get-current-user.decorator';
import { Story } from 'src/story/story.entity';
import { CommentConnection } from './dto/comment.connection';
import { CommentFilterInput } from './dto/comment-filter.input';
import { CommentConnectionArgs } from './args/comment-connection.args';
import { CurrentUser } from 'src/auth/dto/current-user.dto';

@Resolver(() => Comment)
export class CommentResolver {
  constructor(
    private commentService: CommentService,
    private userService: UserService,
    private storyService: StoryService,
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
    filter: CommentFilterInput,
  ): Promise<Comment> {
    return this.commentService.findOne(filter);
  }

  @Mutation(() => CreateCommentPayload)
  async createComment(
    @Args('input') { data }: CreateCommentInput,
    @GetCurrentUser() currentUser: CurrentUser,
  ): Promise<CreateCommentPayload> {
    return {
      comment: await this.commentService.createOne({
        ...data,
        user: currentUser._id,
      }),
    };
  }

  @ResolveField()
  async user(@Parent() comment: Comment): Promise<User> {
    return this.userService.findById(comment.user._id);
  }

  @ResolveField()
  async story(@Parent() comment: Comment): Promise<Story> {
    return this.storyService.findById(comment.story._id);
  }
}
