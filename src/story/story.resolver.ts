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
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/user.entity';
import { CreateStoryPayload } from './dto/create-story.payload';
import { CreateStoryInput } from './dto/create-story.input';
import { GetCurrentUser } from 'src/auth/decorators/get-current-user.decorator';
import { UseGuards } from '@nestjs/common';
import { StoryConnection } from './dto/story.connection';
import { StoryFilterInput } from './dto/story-filter.input';
import { StoryConnectionArgs } from './args/story-connection.args';
import { Tag } from 'src/tag/tag.entity';
import { TagService } from 'src/tag/tag.service';
import { StringService } from 'src/utils/services/string.service';
import { CurrentUser } from 'src/auth/dto/current-user.dto';
import { Like } from 'src/like/like.entity';
import { LikeService } from 'src/like/like.service';

@Resolver(() => Story)
export class StoryResolver {
  constructor(
    private stringService: StringService,
    private storyService: StoryService,
    private userService: UserService,
    private tagService: TagService,
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
    filter: StoryFilterInput = new StoryFilterInput(),
  ): Promise<Story> {
    return this.storyService.findOne(filter);
  }

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
      story: { eq: story._id },
      user: { eq: currentUser._id },
    });
  }

  @ResolveField(() => String)
  async excerpt(@Parent() story: Story): Promise<string> {
    return this.stringService.createExcerpt(story.content);
  }

  @ResolveField()
  async author(@Parent() story: Story): Promise<User> {
    return this.userService.findById(story.author._id);
  }

  @ResolveField()
  async root(@Parent() story: Story): Promise<Story> {
    return this.storyService.findById(story.root?._id);
  }

  @ResolveField()
  async parent(@Parent() story: StoryDocument): Promise<Story> {
    return this.storyService.findById(story.parent?._id);
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

  @ResolveField(() => [Tag], { nullable: true })
  async tags(@Parent() story: Story): Promise<Tag[]> {
    const tags = story.tags.map((tag) => tag._id);
    return this.tagService.findAll({ _id: { in: tags } });
  }
}
