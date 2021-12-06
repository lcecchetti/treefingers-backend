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
import { CommentsInput } from './dto/comments.input';
import { CommentsPaginated } from './comments.paginated';
import { CreateCommentPayload } from './dto/create-comment.payload';
import { CreateCommentInput } from './dto/create-comment.input';
import { CurrentUser } from 'src/user/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
import { Story } from 'src/story/story.entity';

@Resolver(() => Comment)
export class CommentResolver {
  constructor(
    private commentService: CommentService,
    private userService: UserService,
    private storyService: StoryService,
  ) {}

  @Query(() => CommentsPaginated)
  async comments(
    @Args('input', { nullable: true }) input: CommentsInput = new CommentsInput(),
  ): Promise<CommentsPaginated> {
    return this.commentService.paginate(input);
  }

  @Mutation(() => CreateCommentPayload)
  @UseGuards(JwtAuthGuard)
  async createStory(
    @Args('input') input: CreateCommentInput,
    @CurrentUser() user: User,
  ): Promise<CreateCommentPayload> {
    input.user = user._id;
    return { comment: await this.commentService.create(input) };
  }

  @ResolveField(() => User)
  async author(@Parent() comment: Comment): Promise<User> {
    return this.userService.findById(comment.user._id);
  }

  @ResolveField(() => Story, { nullable: true })
  async story(@Parent() comment: Comment): Promise<Story> {
    return this.storyService.findById(comment.story._id);
  }
}
