import { ChildEntity, ManyToOne } from 'typeorm';
import { Comment } from './comment.entity';
import { Story } from 'src/story/story.entity';

@ChildEntity()
export class StoryComment extends Comment {
  @ManyToOne(() => Story, (story) => story.comments)
  entity: Story;
}
