import {
  Resolver,
  Args,
  ResolveField,
  Parent,
  Mutation,
} from '@nestjs/graphql';
import { LikeService } from './like.service';
import { Like } from './like.entity';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/user.entity';
import { CurrentUser } from 'src/auth/dto/current-user.dto';
import { GetCurrentUser } from 'src/auth/decorators/get-current-user.decorator';
import { LikePayload } from './payloads/like.payload';
import { LikeInput } from './inputs/like.input';
import { DislikeInput } from './inputs/dislike.input';
import { DislikePayload } from './payloads/dislike.payload';
import { StoryService } from 'src/story/story.service';
import { CommentService } from 'src/comment/comment.service';
import { Likeable } from './interfaces/likeable.interface';
import { LikeableEntityType } from './enums/likeable-entity-type.enum';

@Resolver(() => Like)
export class LikeResolver {
  constructor(
    private likeService: LikeService,
    private userService: UserService,
    private commentService: CommentService,
    private storyService: StoryService,
  ) {}

  @Mutation(() => LikePayload)
  async like(
    @Args('input') input: LikeInput,
    @GetCurrentUser() currentUser: CurrentUser,
  ): Promise<LikePayload> {
    return {
      like: await this.likeService.like(input, currentUser._id),
    };
  }

  @Mutation(() => DislikePayload)
  async dislike(
    @Args('input') input: DislikeInput,
    @GetCurrentUser() currentUser: CurrentUser,
  ): Promise<DislikePayload> {
    return {
      like: await this.likeService.dislike(input, currentUser._id),
    };
  }

  @ResolveField()
  async user(@Parent() like: Like): Promise<User> {
    return this.userService.findById(like.user._id);
  }

  @ResolveField()
  async entity(@Parent() like: Like): Promise<Likeable> {
    let entity;
    switch (like.entityType) {
      case LikeableEntityType.Story:
        entity = await this.storyService.findById(like.entity._id);
        break;
      case LikeableEntityType.Comment:
        entity = await this.commentService.findById(like.entity._id);
        break;
    }

    entity.likeableEntityType = like.entityType;
    return entity;
  }
}
