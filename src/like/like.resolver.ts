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
import { Story } from 'src/story/story.entity';
import { CommentService } from 'src/comment/comment.service';
import { LikeCommentInput } from './inputs/like-comment';
import { CurrentUser } from 'src/auth/dto/current-user.dto';
import { GetCurrentUser } from 'src/auth/decorators/get-current-user.decorator';
import { DislikeCommentInput } from './inputs/dislike.comment.input';
import { LikeStoryInput } from './inputs/like-story.input';
import { DislikeStoryInput } from './inputs/dislike-story.input';
import { LikeCommentPayload } from './payloads/like-comment.payload';
import { DislikeCommentPayload } from './payloads/dislike-comment.payload';
import { LikeStoryPayload } from './payloads/like-story.payload';
import { DislikeStoryPayload } from './payloads/dislike-story.payload';
import { FilterLikeInput } from './inputs/filter-like.input';

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
    filter: FilterLikeInput,
  ): Promise<Like> {
    return this.likeService.findOne(filter);
  }

  @Mutation(() => LikeCommentPayload)
  async likeComment(
    @Args('input') { comment }: LikeCommentInput,
    @GetCurrentUser() currentUser: CurrentUser,
  ): Promise<LikeCommentPayload> {
    return {
      like: await this.likeService.likeComment(comment, currentUser._id),
    };
  }

  @Mutation(() => DislikeCommentPayload)
  async dislikeComment(
    @Args('input') { comment }: DislikeCommentInput,
    @GetCurrentUser() currentUser: CurrentUser,
  ): Promise<DislikeCommentPayload> {
    return {
      like: await this.likeService.dislikeComment(comment, currentUser._id),
    };
  }

  @Mutation(() => LikeStoryPayload)
  async likeStory(
    @Args('input') { story }: LikeStoryInput,
    @GetCurrentUser() currentUser: CurrentUser,
  ): Promise<LikeStoryPayload> {
    return {
      like: await this.likeService.likeStory(story, currentUser._id),
    };
  }

  @Mutation(() => DislikeStoryPayload)
  async dislikeStory(
    @Args('input') { story }: DislikeStoryInput,
    @GetCurrentUser() currentUser: CurrentUser,
  ): Promise<DislikeStoryPayload> {
    return {
      like: await this.likeService.dislikeStory(story, currentUser._id),
    };
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
