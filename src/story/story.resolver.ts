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
import { CreateStoryPayload } from './dto/create-story.payload';
import { CreateStoryInput } from './dto/create-story.input';
import { CurrentUser } from 'src/user/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
import { StoryConnection } from './dto/story.connection';
import { StoryFilterInput } from './dto/story-filter.input';
import { StoryConnectionArgs } from 'src/comment/args/comment-connection.args';

@Resolver(() => Story)
export class StoryResolver {
  constructor(
    private storyService: StoryService,
    private userService: UserService,
  ) {}

  @Query(() => StoryConnection)
  async stories(
    @Args({ nullable: true })
    args: StoryConnectionArgs = new StoryConnectionArgs(),
  ): Promise<StoryConnection> {
    return this.storyService.paginate(args);
  }

  @Query(() => Story, { nullable: true })
  async story(
    @Args('filter', { nullable: true })
    filter: StoryFilterInput = new StoryFilterInput(),
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

  @ResolveField(() => StoryConnection, { nullable: true })
  async chapters(
    @Parent() story: Story,
    @Args({ nullable: true })
    args: StoryConnectionArgs = new StoryConnectionArgs(),
  ): Promise<StoryConnection> {
    args.filter.parent = story._id;
    return this.storyService.paginate(args);
  }
}
