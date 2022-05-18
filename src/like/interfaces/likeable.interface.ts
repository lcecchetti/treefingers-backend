import { Field, ID, Int, InterfaceType } from '@nestjs/graphql';
import { Comment } from 'src/comment/comment.entity';
import { LikeableEntityType } from '../enums/likeable-entity-type.enum';
import { Like } from '../like.entity';

@InterfaceType({
  resolveType(likeable) {
    switch (likeable.likeableEntityType) {
      case LikeableEntityType.Comment:
        return Comment;
    }
  },
})
export abstract class Likeable {
  @Field(() => ID)
  id: number;

  @Field(() => LikeableEntityType)
  likeableEntityType: LikeableEntityType;

  @Field(() => Int)
  likesCount: number;

  @Field(() => Like, { nullable: true })
  currentUserLike: Like;

  likes: Like[];
}
