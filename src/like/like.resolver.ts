import {
  Resolver,
  Query,
  Args,
  ResolveField,
  Parent,
  Mutation,
} from '@nestjs/graphql';
import { LikeService } from './like.service';
import { Like } from './like.entity';
import { UserService } from 'src/user/user.service';
import { StoryService } from 'src/story/story.service';
import { User } from 'src/user/user.entity';
import { Comment } from 'src/comment/comment.entity';
import { CreateLikePayload } from './dto/create-like.payload';
import { CreateLikeInput } from './dto/create-like.input';
import { CurrentUser } from 'src/user/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
import { Story } from 'src/story/story.entity';
import { CommentService } from 'src/comment/comment.service';
import { LikeInput } from './dto/like.input';

@Resolver(() => Like)
export class LikeResolver {
  constructor(
    private likeService: LikeService,
    private commentService: CommentService,
    private userService: UserService,
    private storyService: StoryService,
  ) {}

  @Query(() => Like, { nullable: true })
  async like(@Args({ nullable: true }) filter: LikeInput): Promise<Like> {
    return this.likeService.findOne(filter);
  }

  @Mutation(() => CreateLikePayload)
  @UseGuards(JwtAuthGuard)
  async createLike(
    @Args('input') { data }: CreateLikeInput,
    @CurrentUser() user: User,
  ): Promise<CreateLikePayload> {
    return { like: await this.likeService.create({ ...data, user: user._id }) };
  }

  @ResolveField()
  async author(@Parent() like: Like): Promise<User> {
    return this.userService.findById(like.author?._id);
  }

  @ResolveField()
  async story(@Parent() like: Like): Promise<Story> {
    return this.storyService.findById(like.story?._id);
  }

  @ResolveField()
  async comment(@Parent() like: Like): Promise<Comment> {
    return this.commentService.findById(like.comment?._id);
  }

  @ResolveField()
  async user(@Parent() like: Like): Promise<User> {
    return this.userService.findById(like.user._id);
  }
}
