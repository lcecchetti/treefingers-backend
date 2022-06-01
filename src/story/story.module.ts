import { Module } from '@nestjs/common';
import { StoryService } from './story.service';
import { StoryResolver } from './story.resolver';
import { PaginationModule } from '../pagination/pagination.module';
import { StoryDataloader } from './dataloaders/story.dataloader';
import { Story } from './story.entity';
import { QueryModule } from '../query/query.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';

@Module({
  imports: [MikroOrmModule.forFeature([Story]), PaginationModule, QueryModule],
  providers: [StoryService, StoryResolver, StoryDataloader],
  exports: [StoryService, StoryDataloader],
})
export class StoryModule {}
