import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StoryService } from './story.service';
import { StoryResolver } from './story.resolver';
import { StorySchema } from './story.entity';
import { UserModule } from 'src/user/user.module';
import { LikeModule } from 'src/like/like.module';
import { CommentModule } from 'src/comment/comment.module';
import { TagModule } from 'src/tag/tag.module';
import { QueryModule } from 'src/query/query.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Story', schema: StorySchema }]),
    QueryModule,
    forwardRef(() => UserModule),
    forwardRef(() => LikeModule),
    forwardRef(() => CommentModule),
    forwardRef(() => TagModule),
  ],
  providers: [StoryService, StoryResolver],
  exports: [StoryService],
})
export class StoryModule {}
