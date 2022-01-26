import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LikeService } from './like.service';
import { LikeResolver } from './like.resolver';
import { LikeSchema } from './like.entity';
import { UserModule } from 'src/user/user.module';
import { StoryModule } from 'src/story/story.module';
import { CommentModule } from 'src/comment/comment.module';
import { QueryModule } from 'src/query/query.module';
import { ForestModule } from 'src/forest/forest.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Like', schema: LikeSchema }]),
    QueryModule,
    forwardRef(() => UserModule),
    forwardRef(() => StoryModule),
    forwardRef(() => CommentModule),
    forwardRef(() => ForestModule),
  ],
  providers: [LikeService, LikeResolver],
  exports: [LikeService],
})
export class LikeModule {}
