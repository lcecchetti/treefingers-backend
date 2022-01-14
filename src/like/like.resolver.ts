import { Resolver, Query, Args, ResolveField, Parent } from '@nestjs/graphql';
import { LikeService } from './like.service';
import { Like } from './like.entity';
import { UserService } from 'src/user/user.service';
import { StoryService } from 'src/story/story.service';
import { User } from 'src/user/user.entity';
import { Comment } from 'src/comment/comment.entity';
import { Story } from 'src/story/story.entity';
import { CommentService } from 'src/comment/comment.service';
import { LikeFilterInput } from './dto/like-filter.input';

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
    filter: LikeFilterInput,
  ): Promise<Like> {
    return this.likeService.findOne(filter);
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
