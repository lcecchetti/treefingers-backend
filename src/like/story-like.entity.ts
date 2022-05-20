import { Story } from 'src/story/story.entity';
import { ChildEntity, ManyToOne } from 'typeorm';
import { LikeableEntityType } from './enums/likeable-entity-type.enum';
import { Like } from './like.entity';

@ChildEntity(LikeableEntityType.Story)
export class StoryLike extends Like {
  @ManyToOne(() => Story, (story) => story.likes)
  entity: Story;
}
