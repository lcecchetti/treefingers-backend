import { ChildEntity, ManyToOne } from 'typeorm';
import { Forest } from 'src/forest/forest.entity';
import { Comment } from './comment.entity';

@ChildEntity()
export class ForestComment extends Comment {
  @ManyToOne(() => Forest, (forest) => forest.comments)
  entity: Forest;
}
