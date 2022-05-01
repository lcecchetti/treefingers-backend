import {
  Resolver,
  Query,
  Args,
  ResolveField,
  Parent,
  Mutation,
} from '@nestjs/graphql';
import { StoryService } from './story.service';
import { Story, StoryDocument } from './story.entity';
import { User } from 'src/user/user.entity';
import { GetCurrentUser } from 'src/auth/decorators/get-current-user.decorator';
import { StoryConnectionArgs } from './args/story-connection.args';
import { Forest } from 'src/forest/forest.entity';
import { StringService } from 'src/utils/services/string.service';
import { CurrentUser } from 'src/auth/dto/current-user.dto';
import { LikeService } from 'src/like/like.service';
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

@Resolver(() => Story)
export class StoryResolver {
  constructor(
    private stringService: StringService,
    private storyService: StoryService,
    private likeService: LikeService,
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
        author: currentUser._id,
      }),
    };
  }

  @ResolveField(() => Like, { nullable: true })
  async currentUserLike(
    @GetCurrentUser() currentUser: CurrentUser,
    @Parent() story: Story,
  ): Promise<Like | null> {
    if (!currentUser) {
      return null;
    }

    return this.likeService.findOne({
      entity: { eq: story._id },
      entityType: LikeableEntityType.Story,
      user: { eq: currentUser._id },
    });
  }

  @ResolveField(() => String)
  async excerpt(@Parent() story: Story): Promise<string> {
    return this.stringService.createExcerpt(story.content);
  }

  @ResolveField()
  async author(
    @Parent() story: Story,
    @Loader(UserDataloader) userDataloader,
  ): Promise<User> {
    return userDataloader.load(String(story.author._id));
  }

  @ResolveField()
  async root(
    @Parent() story: Story,
    @Loader(StoryDataloader) storyDataloader,
  ): Promise<Story | null> {
    if (!story.root) {
      return null;
    }
    return storyDataloader.load(String(story.root._id));
  }

  @ResolveField()
  async parent(
    @Parent() story: StoryDocument,
    @Loader(StoryDataloader) storyDataloader,
  ): Promise<Story | null> {
    if (!story.parent) {
      return null;
    }

    return storyDataloader.load(String(story.parent._id));
  }

  @ResolveField(() => StoryConnection, { nullable: true })
  async chapters(
    @Parent() story: Story,
    @Args({ nullable: true })
    args: StoryConnectionArgs = new StoryConnectionArgs(),
  ): Promise<StoryConnection> {
    args.filter.parent = { eq: story._id };
    return this.storyService.paginate(args);
  }

  @ResolveField(() => Forest, { nullable: true })
  async forest(
    @Parent() story: Story,
    @Loader(ForestDataloader) forestDataloader,
  ): Promise<Forest | null> {
    if (!story.forest) {
      return null;
    }

    return forestDataloader.load(String(story.forest._id));
  }
}
