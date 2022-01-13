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
import { GetCurrentUser } from 'src/auth/decorators/get-current-user.decorator';
import { UseGuards } from '@nestjs/common';
import { Story } from 'src/story/story.entity';
import { CommentService } from 'src/comment/comment.service';
import { LikeFilterInput } from './dto/like-filter.input';
import { CurrentUser } from 'src/auth/dto/current-user.dto';
import { DeleteLikePayload } from './dto/delete-like.payload';
import { DeleteLikeInput } from './dto/delete-like.input';

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
    @Args('filter', { nullable: true })
    filter: LikeFilterInput = new LikeFilterInput(),
  ): Promise<Like> {
    return this.likeService.findOne(filter);
  }

  @Mutation(() => CreateLikePayload)
  async createLike(
    @Args('input') { data }: CreateLikeInput,
    @GetCurrentUser() currentUser: CurrentUser,
  ): Promise<CreateLikePayload> {
    return {
      like: await this.likeService.create({ ...data, user: currentUser._id }),
    };
  }

  @Mutation(() => DeleteLikePayload)
  async deleteLike(
    @Args('input') { filter }: DeleteLikeInput,
    @GetCurrentUser() currentUser: CurrentUser,
  ): Promise<DeleteLikePayload> {
    return {
      like: await this.likeService.deleteOne({
        ...filter,
        user: { eq: currentUser._id },
      }),
    };
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
