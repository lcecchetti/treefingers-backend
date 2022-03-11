import {
  Resolver,
  Query,
  Args,
  ResolveField,
  Parent,
  Mutation,
  Int,
} from '@nestjs/graphql';
import { StoryService } from './story.service';
import { Story, StoryDocument } from './story.entity';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/user.entity';
import { GetCurrentUser } from 'src/auth/decorators/get-current-user.decorator';
import { StoryConnectionArgs } from './args/story-connection.args';
import { Forest } from 'src/forest/forest.entity';
import { ForestService } from 'src/forest/forest.service';
import { StringService } from 'src/utils/services/string.service';
import { CurrentUser } from 'src/auth/dto/current-user.dto';
import { LikeService } from 'src/like/like.service';
import { StoryConnection } from './dto/story-connection.dto';
import { CreateStoryPayload } from './payloads/create-story.payload';
import { CreateStoryInput } from './inputs/create-story.input';
import { FilterStoryInput } from './inputs/filter-story.input';
import { CommentService } from 'src/comment/comment.service';

@Resolver(() => Story)
export class StoryResolver {
  constructor(
    private stringService: StringService,
    private storyService: StoryService,
    private userService: UserService,
    private forestService: ForestService,
    private likeService: LikeService,
    private commentService: CommentService,
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

  @Mutation(() => CreateStoryPayload)
  async createStory(
    @Args('input') input: CreateStoryInput,
    @GetCurrentUser() currentUser: CurrentUser,
  ): Promise<CreateStoryPayload> {
    return {
      story: await this.storyService.create(input, currentUser._id),
    };
  }

  @ResolveField(() => Boolean)
  async currentUserLikes(
    @GetCurrentUser() currentUser: CurrentUser,
    @Parent() story: Story,
  ): Promise<boolean> {
    if (!currentUser) {
      return false;
    }

    return !!(await this.likeService.findOne({
      entity: { eq: story._id },
      entityType: { eq: 'Story' },
      user: { eq: currentUser._id },
    }));
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

  @ResolveField(() => Forest)
  async forest(@Parent() story: Story): Promise<Forest> {
    return this.forestService.findById(story.forest._id);
  }

  @ResolveField(() => Int)
  async likesCount(@Parent() story: Story): Promise<number> {
    return this.likeService.count({
      entity: { eq: story._id },
      entityType: { eq: 'Story' },
    });
  }

  @ResolveField(() => Int)
  async commentsCount(@Parent() story: Story): Promise<number> {
    return this.commentService.count({ story: { eq: story._id } });
  }

  @ResolveField(() => Int)
  async childrenCount(@Parent() story: Story): Promise<number> {
    return this.storyService.count({ parent: { eq: story._id } });
  }
}
