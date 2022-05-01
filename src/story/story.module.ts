import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StoryService } from './story.service';
import { StoryResolver } from './story.resolver';
import { StorySchema } from './story.entity';
import { UserModule } from 'src/user/user.module';
import { LikeModule } from 'src/like/like.module';
import { CommentModule } from 'src/comment/comment.module';
import { ForestModule } from 'src/forest/forest.module';
import { PaginationModule } from 'src/pagination/pagination.module';
import { FilterModule } from 'src/filter/filter.module';
import { StoryDataloader } from './dataloaders/story.dataloader';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Story', schema: StorySchema }]),
    PaginationModule,
    FilterModule,
    forwardRef(() => UserModule),
    forwardRef(() => LikeModule),
    forwardRef(() => CommentModule),
    forwardRef(() => ForestModule),
  ],
  providers: [StoryService, StoryResolver, StoryDataloader],
  exports: [StoryService, StoryDataloader],
})
export class StoryModule {}
