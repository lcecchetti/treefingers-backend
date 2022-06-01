import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentResolver } from './comment.resolver';
import { PaginationModule } from '../pagination/pagination.module';
import { CommentDataloader } from './dataloaders/comment.dataloader';
import { QueryModule } from '../query/query.module';
import { Comment } from './comment.entity';
import { MikroOrmModule } from '@mikro-orm/nestjs';

@Module({
  imports: [
    MikroOrmModule.forFeature([Comment]),
    PaginationModule,
    QueryModule,
  ],
  providers: [CommentService, CommentResolver, CommentDataloader],
  exports: [CommentService, CommentDataloader],
})
export class CommentModule {}
