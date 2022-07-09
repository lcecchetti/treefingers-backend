import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentResolver } from './comment.resolver';
import { PaginationModule } from '../pagination/pagination.module';
import { CommentDataloader } from './dataloaders/comment.dataloader';
import { QueryModule } from '../query/query.module';
import { Comment } from './comment.entity';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { NotificationModule } from '../notification/notification.module';
import { ForestModule } from '../forest/forest.module';
import { StoryModule } from '../story/story.module';

@Module({
  imports: [
    MikroOrmModule.forFeature([Comment]),
    PaginationModule,
    QueryModule,
    NotificationModule,
    ForestModule,
    StoryModule,
  ],
  providers: [CommentService, CommentResolver, CommentDataloader],
  exports: [CommentService, CommentDataloader],
})
export class CommentModule {}
