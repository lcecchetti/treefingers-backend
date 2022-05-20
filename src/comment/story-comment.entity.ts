import { ChildEntity, ManyToOne } from 'typeorm';
import { Comment } from './comment.entity';
import { Story } from 'src/story/story.entity';
import { CommentableEntityType } from './enums/commentable-entity-type.enum';

@ChildEntity(CommentableEntityType.Story)
export class StoryComment extends Comment {
  @ManyToOne(() => Story, (story) => story.comments)
  entity: Story;
}
