import { Field, ID, Int, InterfaceType } from '@nestjs/graphql';
import { Story } from 'src/story/story.entity';
import { Comment } from 'src/comment/comment.entity';
import { LikeableEntityType } from '../enums/likeable-entity-type.enum';

@InterfaceType({
  resolveType(likeable) {
    switch (likeable.likeableEntityType) {
      case LikeableEntityType.Story:
        return Story;
      case LikeableEntityType.Comment:
        return Comment;
    }
  },
})
export abstract class Likeable {
  @Field(() => ID)
  _id: string;

  @Field(() => LikeableEntityType)
  likeableEntityType: LikeableEntityType;

  @Field(() => Int)
  likesCount: number;

  @Field(() => Boolean)
  currentUserLikes: boolean;
}
