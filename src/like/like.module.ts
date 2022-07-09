import { Module } from '@nestjs/common';
import { LikeService } from './like.service';
import { LikeResolver } from './like.resolver';
import { LikeDataloader } from './dataloaders/like.dataloader';
import { QueryModule } from '../query/query.module';
import { Like } from './like.entity';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { NotificationModule } from '../notification/notification.module';
import { StoryModule } from '../story/story.module';
import { CommentModule } from '../comment/comment.module';

@Module({
  imports: [
    MikroOrmModule.forFeature([Like]),
    CommentModule,
    StoryModule,
    NotificationModule,
    QueryModule,
  ],
  providers: [LikeService, LikeResolver, LikeDataloader],
  exports: [LikeService, LikeDataloader],
})
export class LikeModule {}
