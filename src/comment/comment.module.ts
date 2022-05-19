import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentResolver } from './comment.resolver';
import { PaginationModule } from 'src/pagination/pagination.module';
import { CommentDataloader } from './dataloaders/comment.dataloader';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QueryModule } from 'src/query/query.module';
import { Comment } from './comment.entity';
import { ForestComment } from './forest-comment.entity';
import { StoryComment } from './story-comment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Comment, ForestComment, StoryComment]),
    PaginationModule,
    QueryModule,
  ],
  providers: [CommentService, CommentResolver, CommentDataloader],
  exports: [CommentService, CommentDataloader],
})
export class CommentModule {}
