import {
  Resolver,
  Query,
  Args,
  ResolveField,
  Parent,
  Mutation,
} from '@nestjs/graphql';
import { CommentService } from './comment.service';
import { Comment, CommentDocument } from './comment.entity';
import { UserService } from 'src/user/user.service';
import { StoryService } from 'src/story/story.service';
import { User } from 'src/user/user.entity';
import { CreateCommentPayload } from './dto/create-comment.payload';
import { CreateCommentInput } from './dto/create-comment.input';
import { CurrentUser } from 'src/user/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
import { Story } from 'src/story/story.entity';
import { CommentConnection } from './dto/comment.connection';
import { CommentFilterInput } from './dto/comment-filter.input';
import { CommentConnectionArgs } from './args/comment-connection.args';
import { gqlFilterToMongo } from 'src/common/filter/filter.service';

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
    filter: CommentFilterInput = new CommentFilterInput(),
  ): Promise<Comment> {
    const mongoFilter = gqlFilterToMongo<CommentDocument>(filter);
    return this.commentService.findOne(mongoFilter);
  }

  @Mutation(() => CreateCommentPayload)
  @UseGuards(JwtAuthGuard)
  async createComment(
    @Args('input') { data }: CreateCommentInput,
    @CurrentUser() user: User,
  ): Promise<CreateCommentPayload> {
    data.user = user._id;
    return { comment: await this.commentService.create(data) };
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
