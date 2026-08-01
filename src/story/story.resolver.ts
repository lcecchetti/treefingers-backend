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
import { User } from '../user/user.entity';
import { GetCurrentUser } from '../auth/decorators/get-current-user.decorator';
import { StoryConnectionArgs } from './args/story-connection.args';
import { Forest } from '../forest/forest.entity';
import { StringService } from '../common/services/string.service';
import { CurrentUser } from '../auth/dto/current-user.dto';
import { StoryConnection } from './dto/story-connection.dto';
import { CreateStoryPayload } from './payloads/create-story.payload';
import { CreateStoryInput } from './inputs/create-story.input';
import { FilterStoryInput } from './inputs/filter-story.input';
import { Like } from '../like/like.entity';
import { UseGuards } from '@nestjs/common';
import { IsAuthenticatedGuard } from '../auth/guards/is-authenticated.guard';
import { UserDataloader } from '../user/dataloaders/user.dataloader';
import { Loader } from '@tracworx/nestjs-dataloader';
import { StoryDataloader } from './dataloaders/story.dataloader';
import { ForestDataloader } from '../forest/dataloaders/forest.dataloader';
import { LikeDataloader } from '../like/dataloaders/like.dataloader';
import { EditStoryPayload } from './payloads/edit-story.payload';
import { EditStoryInput } from './inputs/edit-story.input';
import { connectionComplexity } from '../graphql/connection-complexity';

@Resolver(() => Story)
export class StoryResolver {
  constructor(
    private stringService: StringService,
    private storyService: StoryService,
  ) {}

  @Query(() => StoryConnection, { complexity: connectionComplexity })
  async stories(
    @Args({ nullable: true })
    args: StoryConnectionArgs = new StoryConnectionArgs(),
    @GetCurrentUser() currentUser: CurrentUser,
  ): Promise<StoryConnection> {
    return this.storyService.paginate(args, currentUser);
  }

  @Query(() => Story, { nullable: true })
  async story(
    @Args('filter', { nullable: true })
    filter: FilterStoryInput,
  ): Promise<Story | null> {
    return this.storyService.findOne(filter);
  }

  @UseGuards(IsAuthenticatedGuard)
  @Mutation(() => CreateStoryPayload)
  async createStory(
    @Args('input') { data }: CreateStoryInput,
    @GetCurrentUser() currentUser: CurrentUser,
  ): Promise<CreateStoryPayload> {
    return {
      story: await this.storyService.create({
        ...data,
        author: currentUser.id,
      }),
    };
  }

  @UseGuards(IsAuthenticatedGuard)
  @Mutation(() => EditStoryPayload)
  async editStory(
    @Args('input') { id, data }: EditStoryInput,
    @GetCurrentUser() currentUser: CurrentUser,
  ): Promise<CreateStoryPayload> {
    return {
      story: await this.storyService.edit(id, data, currentUser),
    };
  }

  @ResolveField(() => Like, { nullable: true })
  async currentUserLike(
    @GetCurrentUser() currentUser: CurrentUser,
    @Parent() story: Story,
    @Loader(LikeDataloader) likeDataloader,
  ): Promise<Like | null> {
    if (!currentUser) {
      return null;
    }

    return likeDataloader.load({
      story: story.id,
      user: currentUser.id,
    });
  }

  @ResolveField(() => Boolean, { defaultValue: false })
  async isEditable(
    @GetCurrentUser() currentUser: CurrentUser,
    @Parent() story: Story,
  ): Promise<boolean> {
    return this.storyService.isEditable(story, currentUser);
  }

  @ResolveField(() => String)
  async excerpt(@Parent() story: Story): Promise<string> {
    return this.stringService.createExcerpt(story.content);
  }

  @ResolveField(() => User)
  async author(
    @Parent() story: Story,
    @Loader(UserDataloader) userDataloader,
  ): Promise<User> {
    return userDataloader.load(story.author.id);
  }

  @ResolveField(() => Story, { nullable: true })
  async parent(
    @Parent() story: Story,
    @Loader(StoryDataloader) storyDataloader,
  ): Promise<Story | null> {
    if (!story.parent) {
      return null;
    }

    return storyDataloader.load(story.parent.id);
  }

  @ResolveField(() => Story, { nullable: true })
  async root(
    @Parent() story: Story,
    @Loader(StoryDataloader) storyDataloader,
  ): Promise<Story | null> {
    if (!story.root) {
      return null;
    }

    return storyDataloader.load(story.root.id);
  }

  @ResolveField(() => Forest, { nullable: true })
  async forest(
    @Parent() story: Story,
    @Loader(ForestDataloader) forestDataloader,
  ): Promise<Forest | null> {
    if (!story.forest) {
      return null;
    }

    return forestDataloader.load(story.forest.id);
  }
}
