import { ChildEntity, ManyToOne } from 'typeorm';
import { Like } from './like.entity';
import { Comment } from 'src/comment/comment.entity';

@ChildEntity()
export class CommentLike extends Like {
  @ManyToOne(() => Comment, (comment) => comment.likes)
  entity: Comment;
}
