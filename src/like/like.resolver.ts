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
  async like(
    @Args('input', { nullable: true }) { filter }: LikeInput = new LikeInput(),
  ): Promise<Like> {
    return this.likeService.findOne(filter);
  }

  @Mutation(() => CreateLikePayload)
  @UseGuards(JwtAuthGuard)
  async createLike(
    @Args('input') input: CreateLikeInput,
    @CurrentUser() user: User,
  ): Promise<CreateLikePayload> {
    input.user = user._id;
    return { like: await this.likeService.create(input) };
  }

  @ResolveField(() => User, { nullable: true })
  async author(@Parent() like: Like): Promise<User> {
    return this.userService.findById(like.author?._id);
  }

  @ResolveField(() => Story)
  async story(@Parent() like: Like): Promise<Story> {
    return this.storyService.findById(like.story?._id);
  }

  @ResolveField(() => Comment)
  async comment(@Parent() like: Like): Promise<Comment> {
    return this.commentService.findById(like.comment?._id);
  }

  @ResolveField(() => User)
  async user(@Parent() like: Like): Promise<User> {
    return this.userService.findById(like.user._id);
  }
}
