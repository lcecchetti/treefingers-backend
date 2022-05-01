import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentService } from './comment.service';
import { CommentResolver } from './comment.resolver';
import { CommentSchema } from './comment.entity';
import { UserModule } from 'src/user/user.module';
import { StoryModule } from 'src/story/story.module';
import { LikeModule } from 'src/like/like.module';
import { ForestModule } from 'src/forest/forest.module';
import { PaginationModule } from 'src/pagination/pagination.module';
import { FilterModule } from 'src/filter/filter.module';
import { ForestSchema } from 'src/forest/forest.entity';
import { StorySchema } from 'src/story/story.entity';
import { CommentDataloader } from './dataloaders/comment.dataloader';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Comment', schema: CommentSchema },
      { name: 'Forest', schema: ForestSchema },
      { name: 'Story', schema: StorySchema },
    ]),
    PaginationModule,
    FilterModule,
    forwardRef(() => UserModule),
    forwardRef(() => StoryModule),
    forwardRef(() => LikeModule),
    forwardRef(() => ForestModule),
  ],
  providers: [CommentService, CommentResolver, CommentDataloader],
  exports: [CommentService, CommentDataloader],
})
export class CommentModule {}
