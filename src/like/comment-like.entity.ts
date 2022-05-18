import { ChildEntity, JoinColumn, ManyToOne } from 'typeorm';
import { Like } from './like.entity';
import { Comment } from 'src/comment/comment.entity';
import { Likeable } from './interfaces/likeable.interface';

@ChildEntity()
export class CommentLike extends Like {
  @ManyToOne(() => Comment, (comment) => comment.likes)
  entity: Likeable;
}
