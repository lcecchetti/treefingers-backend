import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StoryService } from './story.service';
import { StoryResolver } from './story.resolver';
import { StorySchema } from './story.entity';
import { UserModule } from 'src/user/user.module';
import { LikeModule } from 'src/like/like.module';
import { CommentModule } from 'src/comment/comment.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Story', schema: StorySchema }]),
    forwardRef(() => UserModule),
    forwardRef(() => LikeModule),
    forwardRef(() => CommentModule),
  ],
  providers: [StoryService, StoryResolver],
  exports: [StoryService],
})
export class StoryModule {}
