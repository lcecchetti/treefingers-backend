import {
  Resolver,
  Query,
  Args,
  ResolveField,
  Parent,
  Mutation,
  Int,
} from '@nestjs/graphql';
import { CommentService } from './comment.service';
import { Comment } from './comment.entity';
import { UserService } from 'src/user/user.service';
import { StoryService } from 'src/story/story.service';
import { User } from 'src/user/user.entity';
import { GetCurrentUser } from 'src/auth/decorators/get-current-user.decorator';
import { CommentConnectionArgs } from './args/comment-connection.args';
import { CurrentUser } from 'src/auth/dto/current-user.dto';
import { LikeService } from 'src/like/like.service';
import { CommentConnection } from './dto/comment-connection.dto';
import { ForestService } from 'src/forest/forest.service';
import { Like } from 'src/like/like.entity';
import { CommentInput } from './inputs/comment.input';
import { CommentPayload } from './payloads/comment.payload';
import { Commentable } from './interfaces/commentable.interface';
import { CommentableEntityType } from './enums/commentable-entity-type.enum';
import { LikeableEntityType } from 'src/like/enums/likeable-entity-type.enum';
import { UseGuards } from '@nestjs/common';
import { IsAuthenticated } from 'src/auth/guards/is-authenticated.guard';

@Resolver(() => Comment)
export class CommentResolver {
  constructor(
    private commentService: CommentService,
    private userService: UserService,
    private storyService: StoryService,
    private likeService: LikeService,
    private forestService: ForestService,
  ) {}

  @Query(() => CommentConnection)
  async comments(
    @Args()
    args: CommentConnectionArgs = new CommentConnectionArgs(),
  ): Promise<CommentConnection> {
    return this.commentService.paginate(args);
  }

  @UseGuards(IsAuthenticated)
  @Mutation(() => CommentPayload)
  async submitComment(
    @Args('input') input: CommentInput,
    @GetCurrentUser() currentUser: CurrentUser,
  ): Promise<CommentPayload> {
    return {
      comment: await this.commentService.create(input, currentUser._id),
    };
  }

  @ResolveField(() => Like, { nullable: true })
  async currentUserLike(
    @GetCurrentUser() currentUser: CurrentUser,
    @Parent() comment: Comment,
  ): Promise<Like | null> {
    if (!currentUser) {
      return null;
    }

    return this.likeService.findOne({
      entity: { eq: comment._id },
      entityType: LikeableEntityType.Comment,
      user: { eq: currentUser._id },
    });
  }

  @ResolveField(() => Int)
  async likesCount(@Parent() comment: Comment): Promise<number> {
    return this.likeService.count({
      entity: { eq: comment._id },
      entityType: LikeableEntityType.Comment,
    });
  }

  @ResolveField()
  async user(@Parent() comment: Comment): Promise<User> {
    return this.userService.findById(comment.user._id);
  }

  @ResolveField()
  async entity(@Parent() comment: Comment): Promise<Commentable> {
    let entity;
    switch (comment.entityType) {
      case CommentableEntityType.Story:
        entity = await this.storyService.findById(comment.entity._id);
        break;
      case CommentableEntityType.Forest:
        entity = await this.forestService.findById(comment.entity._id);
        break;
    }

    entity.commentableEntityType = comment.entityType;
    return entity;
  }
}
