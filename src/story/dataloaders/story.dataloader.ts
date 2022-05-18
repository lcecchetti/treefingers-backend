import * as DataLoader from 'dataloader';
import { DataloaderProvider } from '@tracworx/nestjs-dataloader';
import { StoryService } from '../story.service';
import { Story } from '../story.entity';

@DataloaderProvider()
export class StoryDataloader {
  constructor(private readonly storyService: StoryService) {}

  createDataloader() {
    return new DataLoader<number, Story>(async (ids) =>
      this.storyService.findMany({ id: { in: [...ids] } }),
    );
  }
}
