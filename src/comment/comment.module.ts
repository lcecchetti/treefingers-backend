import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentService } from './comment.service';
import { CommentResolver } from './comment.resolver';
import { CommentSchema } from './comment.entity';
import { StoryModule } from 'src/story/story.module';
import { ForestModule } from 'src/forest/forest.module';
import { PaginationModule } from 'src/pagination/pagination.module';
import { FilterModule } from 'src/filter/filter.module';
import { CommentDataloader } from './dataloaders/comment.dataloader';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Comment', schema: CommentSchema }]),
    PaginationModule,
    FilterModule,
    StoryModule,
    ForestModule,
  ],
  providers: [CommentService, CommentResolver, CommentDataloader],
  exports: [CommentService, CommentDataloader],
})
export class CommentModule {}
