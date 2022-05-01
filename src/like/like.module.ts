import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LikeService } from './like.service';
import { LikeResolver } from './like.resolver';
import { LikeSchema } from './like.entity';
import { UserModule } from 'src/user/user.module';
import { StoryModule } from 'src/story/story.module';
import { CommentModule } from 'src/comment/comment.module';
import { FilterModule } from 'src/filter/filter.module';
import { LikeDataloader } from './dataloaders/like.dataloader';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Like', schema: LikeSchema }]),
    FilterModule,
    forwardRef(() => UserModule),
    forwardRef(() => StoryModule),
    forwardRef(() => CommentModule),
  ],
  providers: [LikeService, LikeResolver, LikeDataloader],
  exports: [LikeService, LikeDataloader],
})
export class LikeModule {}
