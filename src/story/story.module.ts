import { Module } from '@nestjs/common';
import { StoryService } from './story.service';

@Module({
  providers: [StoryService]
})
export class StoryModule {}
