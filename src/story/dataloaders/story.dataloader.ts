import * as DataLoader from 'dataloader';
import { GqlExecutionContext } from '@nestjs/graphql';
import { DataloaderProvider } from '@tracworx/nestjs-dataloader';
import { StoryService } from '../story.service';
import { Story } from '../story.entity';

@DataloaderProvider()
export class StoryDataloader {
  constructor(private readonly storyService: StoryService) {}

  createDataloader(ctx: GqlExecutionContext) {
    return new DataLoader<string, Story>(async (_ids) =>
      this.storyService.findMany({ _id: { in: [..._ids] } }),
    );
  }
}
