import { Resolver, Query, Args, ResolveField, Parent } from '@nestjs/graphql';
import { UserService } from './user.service';
import { UsersPaginated } from './users.paginated';
import { User } from './user.entity';
import { UserInput } from './dto/user.input';
import { UsersInput } from './dto/users.input';
import { StoryService } from 'src/story/story.service';
import { StoriesPaginated } from 'src/story/stories.paginated';
import { StoriesInput } from 'src/story/dto/stories.input';

@Resolver(() => User)
export class UserResolver {
  constructor(
    private userService: UserService,
    private storyService: StoryService,
  ) {}

  @Query(() => UsersPaginated)
  async users(
    @Args('input', { nullable: true }) input: UsersInput,
  ): Promise<UsersPaginated> {
    return this.userService.paginate(input);
  }

  @Query(() => User, { nullable: true })
  async user(
    @Args('input', { nullable: true }) { filter }: UserInput = new UserInput(),
  ): Promise<User> {
    return this.userService.findOne(filter);
  }

  @ResolveField(() => StoriesPaginated)
  async stories(
    @Args('input', { nullable: true }) input: StoriesInput = new StoriesInput(),
    @Parent() user: User,
  ): Promise<StoriesPaginated> {
    input.filter.author = user._id;
    return this.storyService.paginate(input);
  }
}
