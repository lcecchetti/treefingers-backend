import { ChildEntity, ManyToOne } from 'typeorm';
import { Forest } from 'src/forest/forest.entity';
import { Comment } from './comment.entity';
import { CommentableEntityType } from './enums/commentable-entity-type.enum';

@ChildEntity(CommentableEntityType.Forest)
export class ForestComment extends Comment {
  @ManyToOne(() => Forest, (forest) => forest.comments)
  entity: Forest;
}
