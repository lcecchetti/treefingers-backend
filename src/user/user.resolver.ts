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
    const mongoFilter = gqlFilterToMongo<UserDocument>(filter);
    return this.userService.findOne(mongoFilter);
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
