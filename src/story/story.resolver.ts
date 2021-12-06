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

  @ResolveField(() => Story, { nullable: true })
  async root(@Parent() story: Story): Promise<Story> {
    return this.storyService.findById(story.root?._id);
  }

  @ResolveField(() => Story, { nullable: true })
  async parent(@Parent() story: Story): Promise<Story> {
    return this.storyService.findById(story.parent?._id);
  }

  @ResolveField(() => StoriesPaginated, { nullable: true })
  async chapters(
    @Parent() story: Story,
    @Args('input', { nullable: true }) input: StoriesInput = new StoriesInput(),
  ): Promise<StoriesPaginated> {
    input.filter.parent = story._id;
    return this.storyService.paginate(input);
  }
}
