import {
  Resolver,
  Query,
  Args,
  ResolveField,
  Parent,
  Int,
  Mutation,
} from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './user.entity';
import { StoryService } from 'src/story/story.service';
import { UserConnectionArgs } from './args/user-connection.args';
import { StoryConnectionArgs } from 'src/story/args/story-connection.args';
import { GetCurrentUser } from '../auth/decorators/get-current-user.decorator';
import { StringService } from 'src/utils/services/string.service';
import { CurrentUser } from 'src/auth/dto/current-user.dto';
import { UserConnection } from './dto/user-connection.dto';
import { StoryConnection } from 'src/story/dto/story-connection.dto';
import { FilterUserInput } from './inputs/filter-user.input';
import { Followership } from 'src/followership/followership.entity';
import { FollowershipService } from 'src/followership/followership.service';
import { IsAuthenticatedGuard } from 'src/auth/guards/is-authenticated.guard';
import { UseGuards } from '@nestjs/common';
import { EditUserPayload } from './payloads/edit-user.payload';
import { EditUserInput } from './inputs/edit-user.input';

@Resolver(() => User)
export class UserResolver {
  constructor(
    private stringService: StringService,
    private userService: UserService,
    private storyService: StoryService,
    private followershipService: FollowershipService,
  ) {}

  @Query(() => UserConnection)
  async users(
    @Args()
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
  ): Promise<CurrentUser | null> {
    if (!currentUser) {
      return null;
    }
    return this.userService.findById(currentUser._id);
  }

  @UseGuards(IsAuthenticatedGuard)
  @Mutation(() => EditUserPayload)
  async editUser(
    @Args('input') { data }: EditUserInput,
    @GetCurrentUser() currentUser: CurrentUser,
  ): Promise<EditUserPayload> {
    return {
      user: await this.userService.edit(currentUser._id, data),
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
  async storiesCount(@Parent() user: User): Promise<number> {
    return this.storyService.count({ author: { eq: user._id } });
  }

  @ResolveField(() => Followership, { nullable: true })
  async currentUserFollowership(
    @GetCurrentUser() currentUser: CurrentUser,
    @Parent() user: User,
  ): Promise<Followership | null> {
    if (!currentUser) {
      return null;
    }

    return this.followershipService.findOne({
      followed: { eq: user._id },
      follower: { eq: currentUser._id },
    });
  }

  @ResolveField(() => Int)
  async followersCount(@Parent() user: User): Promise<number> {
    return this.followershipService.count({
      followed: { eq: user._id },
    });
  }
}
