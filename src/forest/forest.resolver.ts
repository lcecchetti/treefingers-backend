import {
  Resolver,
  Query,
  Args,
  ResolveField,
  Parent,
  Mutation,
  Int,
} from '@nestjs/graphql';
import { ForestService } from './forest.service';
import { Forest } from './forest.entity';
import { StoryService } from 'src/story/story.service';
import { ForestConnectionArgs } from './args/forest-connection.args';
import { StoryConnectionArgs } from 'src/story/args/story-connection.args';
import { CreateForestPayload } from './payloads/create-forest.payload';
import { CreateForestInput } from './inputs/create-forest.input';
import { StoryConnection } from 'src/story/dto/story-connection.dto';
import { FilterForestInput } from './inputs/filter-forest.input';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { StringService } from 'src/utils/services/string.service';
import { CommentService } from 'src/comment/comment.service';
import { CommentableEntityType } from 'src/comment/enums/commentable-entity-type.enum';
import { ForestConnection } from './dto/forest-connection.dto';
import { Membership } from 'src/membership/membership.entity';
import { GetCurrentUser } from 'src/auth/decorators/get-current-user.decorator';
import { CurrentUser } from 'src/auth/dto/current-user.dto';
import { MembershipService } from 'src/membership/membership.service';
import { UseGuards } from '@nestjs/common';
import { IsAuthenticatedGuard } from 'src/auth/guards/is-authenticated.guard';

@Resolver(() => Forest)
export class ForestResolver {
  constructor(
    private stringService: StringService,
    private forestService: ForestService,
    private storyService: StoryService,
    private userService: UserService,
    private commentService: CommentService,
    private membershipService: MembershipService,
  ) {}

  @Query(() => ForestConnection)
  async forests(
    @Args()
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
  @UseGuards(IsAuthenticatedGuard)
  async createForest(
    @Args('input') input: CreateForestInput,
    @GetCurrentUser() currentUser: CurrentUser,
  ): Promise<CreateForestPayload> {
    return { forest: await this.forestService.create(input, currentUser._id) };
  }

  @ResolveField(() => String)
  async excerpt(@Parent() forest: Forest): Promise<string> {
    return this.stringService.createExcerpt(forest.about);
  }

  @ResolveField(() => User)
  async founder(@Parent() forest: Forest): Promise<User> {
    return this.userService.findById(forest.founder._id);
  }

  @ResolveField(() => Int)
  async commentsCount(@Parent() forest: Forest): Promise<number> {
    return this.commentService.count({
      entity: { eq: forest._id },
      entityType: CommentableEntityType.Forest,
    });
  }

  @ResolveField(() => Int)
  async storiesCount(@Parent() forest: Forest): Promise<number> {
    return this.storyService.count({ forest: { eq: forest._id } });
  }

  @ResolveField(() => Int)
  async membersCount(@Parent() forest: Forest): Promise<number> {
    return this.membershipService.count({
      forest: { eq: forest._id },
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

  @ResolveField(() => Membership, { nullable: true })
  async currentUserMembership(
    @GetCurrentUser() currentUser: CurrentUser,
    @Parent() forest: Forest,
  ): Promise<Membership | null> {
    if (!currentUser) {
      return null;
    }

    return this.membershipService.findOne({
      forest: { eq: forest._id },
      member: { eq: currentUser._id },
    });
  }
}
