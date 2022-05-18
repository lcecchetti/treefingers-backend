import { Module } from '@nestjs/common';
import { LikeService } from './like.service';
import { LikeResolver } from './like.resolver';
import { LikeDataloader } from './dataloaders/like.dataloader';
import { QueryModule } from 'src/query/query.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Like } from './like.entity';
import { CommentLike } from './comment-like.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Like, CommentLike]), QueryModule],
  providers: [LikeService, LikeResolver, LikeDataloader],
  exports: [LikeService, LikeDataloader],
})
export class LikeModule {}
