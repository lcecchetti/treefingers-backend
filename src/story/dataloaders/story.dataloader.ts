import DataLoader from 'dataloader';
import { DataloaderProvider } from '@tracworx/nestjs-dataloader';
import { StoryService } from '../story.service';
import { Story } from '../story.entity';

@DataloaderProvider()
export class StoryDataloader {
  constructor(private readonly storyService: StoryService) {}

  createDataloader() {
    return new DataLoader<number, Story>(async (ids) => {
      const stories = await this.storyService.findMany({
        id: { in: [...ids] },
      });
      return ids.map((id) => stories.find((story) => story.id === id));
    });
  }
}
