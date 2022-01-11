import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentService } from './comment.service';
import { CommentResolver } from './comment.resolver';
import { CommentSchema } from './comment.entity';
import { UserModule } from 'src/user/user.module';
import { StoryModule } from 'src/story/story.module';
import { LikeModule } from 'src/like/like.module';
import { QueryModule } from 'src/query/query.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Comment', schema: CommentSchema }]),
    QueryModule,
    forwardRef(() => UserModule),
    forwardRef(() => StoryModule),
    forwardRef(() => LikeModule),
  ],
  providers: [CommentService, CommentResolver],
  exports: [CommentService],
})
export class CommentModule {}
