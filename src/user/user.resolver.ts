import { Resolver, Query, Args, ResolveField, Parent } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User, UserDocument } from './user.entity';
import { StoryService } from 'src/story/story.service';
import { UserConnection } from './dto/user.connection';
import { StoryConnection } from 'src/story/dto/story.connection';
import { UserFilterInput } from './dto/user-filter.input';
import { UserConnectionArgs } from './args/user-connection.args';
import { StoryConnectionArgs } from 'src/story/args/story-connection.args';
import { gqlFilterToMongo } from 'src/common/filter/filter.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { StringService } from 'src/utils/services/string.service';

@Resolver(() => User)
export class UserResolver {
  constructor(
    private stringService: StringService,
    private userService: UserService,
    private storyService: StoryService,
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
    const mongoFilter = gqlFilterToMongo<UserDocument>(filter);
    return this.userService.findOne(mongoFilter);
  }

  @Query(() => User, { nullable: true })
  @UseGuards(JwtAuthGuard)
  async currentUser(@CurrentUser() user): Promise<User | null> {
    if (!user) {
      return null;
    }
    return this.userService.findById(user._id);
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
