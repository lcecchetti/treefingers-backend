import { ChildEntity, JoinColumn, ManyToOne } from 'typeorm';
import { Forest } from 'src/forest/forest.entity';
import { Comment } from './comment.entity';
import { Commentable } from './interfaces/commentable.interface';

@ChildEntity()
export class ForestComment extends Comment {
  @ManyToOne(() => Forest, (forest) => forest.comments)
  @JoinColumn()
  entity: Commentable;
}
