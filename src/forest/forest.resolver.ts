import {
  Resolver,
  Query,
  Args,
  ResolveField,
  Parent,
  Mutation,
} from '@nestjs/graphql';
import { ForestService } from './forest.service';
import { Forest } from './forest.entity';
import { StoryService } from 'src/story/story.service';
import { ForestConnectionArgs } from './args/forest-connection.args';
import { StoryConnectionArgs } from 'src/story/args/story-connection.args';
import { ForestConnection } from './dto/forest-connection.dto';
import { CreateForestPayload } from './payloads/create-forest.payload';
import { CreateForestInput } from './inputs/create-forest.input';
import { StoryConnection } from 'src/story/dto/story-connection.dto';
import { FilterForestInput } from './inputs/filter-forest.input';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { GetCurrentUser } from 'src/auth/decorators/get-current-user.decorator';
import { CurrentUser } from 'src/auth/dto/current-user.dto';
import { Like } from 'src/like/like.entity';
import { LikeService } from 'src/like/like.service';
import { StringService } from 'src/utils/services/string.service';

@Resolver(() => Forest)
export class ForestResolver {
  constructor(
    private stringService: StringService,
    private forestService: ForestService,
    private storyService: StoryService,
    private userService: UserService,
    private likeService: LikeService,
  ) {}

  @Query(() => ForestConnection)
  async forests(
    @Args({ nullable: true })
    args: ForestConnectionArgs = new ForestConnectionArgs(),
  ): Promise<ForestConnection> {
    return this.forestService.paginate(args);
  }

  @Query(() => Forest, { nullable: true })
  async forest(
    @Args('filter', { nullable: true })
    filter: FilterForestInput,
  ): Promise<Forest> {
    return this.forestService.findOne(filter);
  }

  @Mutation(() => CreateForestPayload)
  async createForest(
    @Args('input') input: CreateForestInput,
  ): Promise<CreateForestPayload> {
    return { forest: await this.forestService.create(input) };
  }

  @ResolveField(() => String)
  async excerpt(@Parent() forest: Forest): Promise<string> {
    return this.stringService.createExcerpt(forest.about);
  }

  @ResolveField(() => User)
  async owner(@Parent() forest: Forest): Promise<User> {
    return this.userService.findById(forest.owner._id);
  }

  @ResolveField(() => Like, { nullable: true })
  async currentUserLike(
    @GetCurrentUser() currentUser: CurrentUser,
    @Parent() forest: Forest,
  ): Promise<Like | null> {
    if (!currentUser) {
      return null;
    }

    return this.likeService.findOne({
      forest: { eq: forest._id },
      user: { eq: currentUser._id },
    });
  }

  @ResolveField(() => StoryConnection)
  async stories(
    @Args({ nullable: true })
    args: StoryConnectionArgs = new StoryConnectionArgs(),
    @Parent() forest: Forest,
  ): Promise<StoryConnection> {
    args.filter.forest = { eq: forest._id };
    return this.storyService.paginate(args);
  }
}
