import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StoryService } from './story.service';
import { StoryResolver } from './story.resolver';
import { Story, StorySchema } from './story.entity';
import { PaginationModule } from 'src/pagination/pagination.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Story.name, schema: StorySchema }]),
    PaginationModule,
    UserModule,
  ],
  providers: [StoryService, StoryResolver],
})
export class StoryModule {}
