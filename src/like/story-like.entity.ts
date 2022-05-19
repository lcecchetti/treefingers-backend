import { Story } from 'src/story/story.entity';
import { ChildEntity, ManyToOne } from 'typeorm';
import { Like } from './like.entity';

@ChildEntity()
export class StoryLike extends Like {
  @ManyToOne(() => Story, (story) => story.likes)
  entity: Story;
}
