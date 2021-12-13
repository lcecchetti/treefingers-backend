import {
  Resolver,
  Query,
  Args,
  ResolveField,
  Parent,
  Mutation,
} from '@nestjs/graphql';
import { StoryService } from './story.service';
import { Story } from './story.entity';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/user.entity';
import { StoriesInput } from './dto/stories.input';
import { StoriesPaginated } from './stories.paginated';
import { CreateStoryPayload } from './dto/create-story.payload';
import { CreateStoryInput } from './dto/create-story.input';
import { CurrentUser } from 'src/user/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
import { StoryInput } from './dto/story.input';

@Resolver(() => Story)
export class StoryResolver {
  constructor(
    private storyService: StoryService,
    private userService: UserService,
  ) {}

  @Query(() => StoriesPaginated)
  async stories(
    @Args('input', { nullable: true }) input: StoriesInput = new StoriesInput(),
  ): Promise<StoriesPaginated> {
    return this.storyService.paginate(input);
  }

  @Query(() => Story, { nullable: true })
  async story(
    @Args('input', { nullable: true })
    { filter }: StoryInput = new StoryInput(),
  ): Promise<Story> {
    return this.storyService.findOne(filter);
  }

  @Mutation(() => CreateStoryPayload)
  @UseGuards(JwtAuthGuard)
  async createStory(
    @Args('input') input: CreateStoryInput,
    @CurrentUser() user: User,
  ): Promise<CreateStoryPayload> {
    input.author = user._id;
    return { story: await this.storyService.create(input) };
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
