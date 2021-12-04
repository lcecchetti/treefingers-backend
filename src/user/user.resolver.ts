import { Resolver, Query, Args, ResolveField, Parent } from '@nestjs/graphql';
import { UserService } from './user.service';
import { UserConnection } from './user.connection';
import { User } from './user.entity';
import { UserInput } from './dto/user.input';
import { UsersInput } from './dto/users.input';

@Resolver(() => User)
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query(() => UserConnection)
  async users(
    @Args('input', { nullable: true }) input: UsersInput,
  ): Promise<UserConnection> {
    return this.userService.paginate(input);
  }

  @Query(() => User, { nullable: true })
  async user(
    @Args('input', { nullable: true }) { filter }: UserInput = new UserInput(),
  ): Promise<User> {
    return this.userService.findOne(filter);
  }

  /*@ResolveField()
  async stories(
    @Args('input', { nullable: true }) input: StoriesInput,
    @Parent() user: User,
  ): Promise<StoryConnection> {
    input.filter.author = user._id;
    return this.storyService.paginate(input);
  }*/
}
