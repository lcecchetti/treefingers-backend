import { Field, ID, Int, InterfaceType } from '@nestjs/graphql';
import { Forest } from 'src/forest/forest.entity';
import { Story } from 'src/story/story.entity';
import { CommentableEntityType } from '../enums/commentable-entity-type.enum';

@InterfaceType({
  resolveType(commentable) {
    switch (commentable.commentableEntityType) {
      case CommentableEntityType.Forest:
        return Forest;
      case CommentableEntityType.Story:
        return Story;
    }
  },
})
export abstract class Commentable {
  @Field(() => ID)
  id: number;

  @Field(() => CommentableEntityType)
  commentableEntityType: CommentableEntityType;

  @Field(() => Int)
  commentsCount: number;
}
