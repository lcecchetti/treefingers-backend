import { ChildEntity, ManyToOne } from 'typeorm';
import { Like } from './like.entity';
import { Comment } from 'src/comment/comment.entity';
import { LikeableEntityType } from './enums/likeable-entity-type.enum';

@ChildEntity(LikeableEntityType.Comment)
export class CommentLike extends Like {
  @ManyToOne(() => Comment, (comment) => comment.likes)
  entity: Comment;
}
