import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StoryService } from './story.service';
import { StoryResolver } from './story.resolver';
import { Story, StorySchema } from './story.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Story.name, schema: StorySchema }]),
  ],
  providers: [StoryService, StoryResolver],
})
export class StoryModule {}
