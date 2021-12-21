import { Resolver, Query, Args, ResolveField, Parent } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './user.entity';
import { UserInput } from './dto/user.input';
import { StoryService } from 'src/story/story.service';
import { UserConnection } from './dto/user.connection';
import { UserConnectionInput } from './dto/user-connection.input';
import { StoryConnection } from 'src/story/dto/story.connection';
import { StoryConnectionInput } from 'src/story/dto/story-connection.input';

@Resolver(() => User)
export class UserResolver {
  constructor(
    private userService: UserService,
    private storyService: StoryService,
  ) {}

  @Query(() => UserConnection)
  async users(
    @Args('input', { nullable: true })
    input: UserConnectionInput = new UserConnectionInput(),
  ): Promise<UserConnection> {
    return this.userService.paginate(input);
  }

  @Query(() => User, { nullable: true })
  async user(
    @Args('input', { nullable: true }) { filter }: UserInput = new UserInput(),
  ): Promise<User> {
    return this.userService.findOne(filter);
  }

  @ResolveField(() => StoryConnection)
  async stories(
    @Args('input', { nullable: true }) input: StoryConnectionInput = new StoryConnectionInput(),
    @Parent() user: User,
  ): Promise<StoryConnection> {
    input.filter.author = user._id;
    return this.storyService.paginate(input);
  }
}
