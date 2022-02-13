import {
  Resolver,
  Query,
  Args,
  ResolveField,
  Parent,
  Int,
} from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './user.entity';
import { StoryService } from 'src/story/story.service';
import { UserConnectionArgs } from './args/user-connection.args';
import { StoryConnectionArgs } from 'src/story/args/story-connection.args';
import { GetCurrentUser } from '../auth/decorators/get-current-user.decorator';
import { StringService } from 'src/utils/services/string.service';
import { CurrentUser } from 'src/auth/dto/current-user.dto';
import { LikeService } from 'src/like/like.service';
import { UserConnection } from './dto/user-connection.dto';
import { StoryConnection } from 'src/story/dto/story-connection.dto';
import { FilterUserInput } from './inputs/filter-user.input';
import { CurrentUserData } from './dto/current-user-data.dto';

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
    filter: FilterUserInput,
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

  @ResolveField(() => CurrentUserData, { nullable: true })
  async currentUserData(
    @GetCurrentUser() currentUser: CurrentUser,
    @Parent() user: User,
  ): Promise<CurrentUserData | null> {
    if (!currentUser) {
      return null;
    }

    return {
      like: await this.likeService.findOne({
        author: { eq: user._id },
        user: { eq: currentUser._id },
      }),
    };
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

  @ResolveField(() => Int)
  async likesCount(@Parent() user: User): Promise<number> {
    return this.likeService.count({ author: { eq: user._id } });
  }

  @ResolveField(() => Int)
  async storiesCount(@Parent() user: User): Promise<number> {
    return this.storyService.count({ author: { eq: user._id } });
  }
}
