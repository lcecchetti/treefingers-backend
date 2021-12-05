import { Resolver, Query, Args, ResolveField, Parent } from '@nestjs/graphql';
import { StoryService } from './story.service';
import { Story } from './story.entity';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/user.entity';
import { StoriesInput } from './dto/stories.input';
import { StoriesPaginated } from './stories.paginated';
@Resolver(() => Story)
export class StoryResolver {
  constructor(
    private storyService: StoryService,
    private userService: UserService,
  ) {}

  @Query(() => StoriesPaginated)
  async stories(
    @Args('input', { nullable: true }) input: StoriesInput,
  ): Promise<StoriesPaginated> {
    return this.storyService.paginate(input);
  }

  @ResolveField(() => User)
  async author(@Parent() story: Story): Promise<User> {
    return this.userService.findById(story.author._id);
  }
}
