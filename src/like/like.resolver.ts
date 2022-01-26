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
import { LikeAuthorPayload } from './payloads/like-author.payload';
import { LikeAuthorInput } from './inputs/like-author.input';
import { DislikeAuthorPayload } from './payloads/dislike-author.payload';
import { DislikeAuthorInput } from './inputs/dislike-author.input';
import { LikeCommentPayload } from './payloads/like-comment.payload';
import { DislikeCommentPayload } from './payloads/dislike-comment.payload';
import { LikeStoryPayload } from './payloads/like-story.payload';
import { DislikeStoryPayload } from './payloads/dislike-story.payload';
import { FilterLikeInput } from './inputs/filter-like.input';
import { Forest } from 'src/forest/forest.entity';
import { ForestService } from 'src/forest/forest.service';
import { LikeForestPayload } from './payloads/like-forest.payload';
import { LikeForestInput } from './inputs/like-forest.input';
import { DislikeForestPayload } from './payloads/dislike-forest.payload';
import { DislikeForestInput } from './inputs/dislike-forest.input';

@Resolver(() => Like)
export class LikeResolver {
  constructor(
    private likeService: LikeService,
    private commentService: CommentService,
    private userService: UserService,
    private storyService: StoryService,
    private forestService: ForestService,
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
    @Args('input') input: LikeCommentInput,
    @GetCurrentUser() currentUser: CurrentUser,
  ): Promise<LikeCommentPayload> {
    return {
      like: await this.likeService.likeComment(input, currentUser._id),
    };
  }

  @Mutation(() => DislikeCommentPayload)
  async dislikeComment(
    @Args('input') input: DislikeCommentInput,
    @GetCurrentUser() currentUser: CurrentUser,
  ): Promise<DislikeCommentPayload> {
    return {
      like: await this.likeService.dislikeComment(input, currentUser._id),
    };
  }

  @Mutation(() => LikeStoryPayload)
  async likeStory(
    @Args('input') input: LikeStoryInput,
    @GetCurrentUser() currentUser: CurrentUser,
  ): Promise<LikeStoryPayload> {
    return {
      like: await this.likeService.likeStory(input, currentUser._id),
    };
  }

  @Mutation(() => DislikeStoryPayload)
  async dislikeStory(
    @Args('input') input: DislikeStoryInput,
    @GetCurrentUser() currentUser: CurrentUser,
  ): Promise<DislikeStoryPayload> {
    return {
      like: await this.likeService.dislikeStory(input, currentUser._id),
    };
  }

  @Mutation(() => LikeAuthorPayload)
  async likeAuthor(
    @Args('input') input: LikeAuthorInput,
    @GetCurrentUser() currentUser: CurrentUser,
  ): Promise<LikeAuthorPayload> {
    return {
      like: await this.likeService.likeAuthor(input, currentUser._id),
    };
  }

  @Mutation(() => DislikeAuthorPayload)
  async dislikeAuthor(
    @Args('input') input: DislikeAuthorInput,
    @GetCurrentUser() currentUser: CurrentUser,
  ): Promise<DislikeAuthorPayload> {
    return {
      like: await this.likeService.dislikeAuthor(input, currentUser._id),
    };
  }

  @Mutation(() => LikeForestPayload)
  async likeForest(
    @Args('input') input: LikeForestInput,
    @GetCurrentUser() currentUser: CurrentUser,
  ): Promise<LikeForestPayload> {
    return {
      like: await this.likeService.likeForest(input, currentUser._id),
    };
  }

  @Mutation(() => DislikeForestPayload)
  async dislikeForest(
    @Args('input') input: DislikeForestInput,
    @GetCurrentUser() currentUser: CurrentUser,
  ): Promise<DislikeForestPayload> {
    return {
      like: await this.likeService.dislikeForest(input, currentUser._id),
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
  async forest(@Parent() like: Like): Promise<Forest> {
    return this.forestService.findById(like.forest?._id);
  }

  @ResolveField()
  async user(@Parent() like: Like): Promise<User> {
    return this.userService.findById(like.user._id);
  }
}
