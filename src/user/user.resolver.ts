import { Resolver, Query, Args, ResolveField, Parent, Mutation } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './user.entity';
import { StoryService } from 'src/story/story.service';
import { UserConnection } from './dto/user.connection';
import { StoryConnection } from 'src/story/dto/story.connection';
import { UserFilterInput } from './dto/user-filter.input';
import { UserConnectionArgs } from './args/user-connection.args';
import { StoryConnectionArgs } from 'src/story/args/story-connection.args';
import { GetCurrentUser } from '../auth/decorators/get-current-user.decorator';
import { StringService } from 'src/utils/services/string.service';
import { CurrentUser } from 'src/auth/dto/current-user.dto';
import { Like } from 'src/like/like.entity';
import { LikeService } from 'src/like/like.service';
import { LikeAuthorInput } from 'src/like/dto/like.input';
import { LikeAuthorPayload } from 'src/like/dto/like.payload';
import { DislikeAuthorPayload } from 'src/like/dto/dislike.payload';
import { DislikeAuthorInput } from 'src/like/dto/dislike.input';

@Resolver(() => User)
export class UserResolver {
  constructor(
    private stringService: StringService,
    private userService: UserService,
    private storyService: StoryService,
    private likeService: LikeService,
  ) {}

  @Query(() => UserConnection)
  async users(
    @Args({ nullable: true })
    args: UserConnectionArgs = new UserConnectionArgs(),
  ): Promise<UserConnection> {
    return this.userService.paginate(args);
  }

  @Query(() => User, { nullable: true })
  async user(
    @Args('filter', { nullable: true })
    filter: UserFilterInput,
  ): Promise<User> {
    return this.userService.findOne(filter);
  }

  @Query(() => User, { nullable: true })
  async currentUser(
    @GetCurrentUser() currentUser: CurrentUser,
  ): Promise<User | null> {
    if (!currentUser) {
      return null;
    }
    return this.userService.findById(currentUser._id);
  }

  @Mutation(() => LikeAuthorPayload)
  async likeAuthor(
    @Args('input') { author }: LikeAuthorInput,
    @GetCurrentUser() currentUser: CurrentUser,
  ): Promise<LikeAuthorPayload> {
    return {
      like: await this.likeService.createOne({
        author,
        user: currentUser._id,
      }),
    };
  }

  @Mutation(() => DislikeAuthorPayload)
  async dislikeAuthor(
    @Args('input') { author }: DislikeAuthorInput,
    @GetCurrentUser() currentUser: CurrentUser,
  ): Promise<DislikeAuthorPayload> {
    return {
      like: await this.likeService.deleteOne({
        author: { eq: author },
        user: { eq: currentUser._id },
      }),
    };
  }

  @ResolveField(() => Like, { nullable: true })
  async currentUserLike(
    @GetCurrentUser() currentUser: CurrentUser,
    @Parent() author: User,
  ): Promise<Like | null> {
    if (!currentUser) {
      return null;
    }

    return this.likeService.findOne({
      author: { eq: author._id },
      user: { eq: currentUser._id },
    });
  }

  @ResolveField(() => String)
  async excerpt(@Parent() user: User): Promise<string> {
    return this.stringService.createExcerpt(user.bio);
  }

  @ResolveField(() => StoryConnection)
  async stories(
    @Args({ nullable: true })
    args: StoryConnectionArgs = new StoryConnectionArgs(),
    @Parent() user: User,
  ): Promise<StoryConnection> {
    args.filter.author = { eq: user._id };
    return this.storyService.paginate(args);
  }
}
