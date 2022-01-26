import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ForestService } from './forest.service';
import { ForestResolver } from './forest.resolver';
import { ForestSchema } from './forest.entity';
import { StoryModule } from 'src/story/story.module';
import { QueryModule } from 'src/query/query.module';
import { UserModule } from 'src/user/user.module';
import { LikeModule } from 'src/like/like.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Forest', schema: ForestSchema }]),
    QueryModule,
    forwardRef(() => LikeModule),
    forwardRef(() => StoryModule),
    forwardRef(() => UserModule),
  ],
  providers: [ForestService, ForestResolver],
  exports: [ForestService],
})
export class ForestModule {}
