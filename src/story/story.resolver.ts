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
import { User } from 'src/user/user.entity';
import { GetCurrentUser } from 'src/auth/decorators/get-current-user.decorator';
import { StoryConnectionArgs } from './args/story-connection.args';
import { Forest } from 'src/forest/forest.entity';
import { StringService } from 'src/common/services/string.service';
import { CurrentUser } from 'src/auth/dto/current-user.dto';
import { StoryConnection } from './dto/story-connection.dto';
import { CreateStoryPayload } from './payloads/create-story.payload';
import { CreateStoryInput } from './inputs/create-story.input';
import { FilterStoryInput } from './inputs/filter-story.input';
import { Like } from 'src/like/like.entity';
import { LikeableEntityType } from 'src/like/enums/likeable-entity-type.enum';
import { UseGuards } from '@nestjs/common';
import { IsAuthenticatedGuard } from 'src/auth/guards/is-authenticated.guard';
import { UserDataloader } from 'src/user/dataloaders/user.dataloader';
import { Loader } from '@tracworx/nestjs-dataloader';
import { StoryDataloader } from './dataloaders/story.dataloader';
import { ForestDataloader } from 'src/forest/dataloaders/forest.dataloader';
import { LikeDataloader } from 'src/like/dataloaders/like.dataloader';

@Resolver(() => Story)
export class StoryResolver {
  constructor(
    private stringService: StringService,
    private storyService: StoryService,
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
    filter: FilterStoryInput,
  ): Promise<Story> {
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
      entityType: LikeableEntityType.Story,
      entity: story.id,
      user: currentUser.id,
    });
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
    if (!story.parent || story.path.length <= 1) {
      return null;
    }
    return storyDataloader.load(story.path[0]);
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
