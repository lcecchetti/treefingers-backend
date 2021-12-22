import { Resolver, Query, Args, ResolveField, Parent } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './user.entity';
import { StoryService } from 'src/story/story.service';
import { UserConnection } from './dto/user.connection';
import { StoryConnection } from 'src/story/dto/story.connection';
import { UserFilterInput } from './dto/user-filter.input';
import { UserConnectionArgs } from './args/user-connection.args';
import { StoryConnectionArgs } from 'src/story/args/story-connection.args';

@Resolver(() => User)
export class UserResolver {
  constructor(
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
    filter: UserFilterInput = new UserFilterInput(),
  ): Promise<User> {
    return this.userService.findOne(filter);
  }

  @ResolveField(() => StoryConnection)
  async stories(
    @Args({ nullable: true })
    args: StoryConnectionArgs = new StoryConnectionArgs(),
    @Parent() user: User,
  ): Promise<StoryConnection> {
    args.filter.author = user._id;
    return this.storyService.paginate(args);
  }
}
