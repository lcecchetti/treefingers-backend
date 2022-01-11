import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TagService } from './tag.service';
import { TagResolver } from './tag.resolver';
import { TagSchema } from './tag.entity';
import { StoryModule } from 'src/story/story.module';
import { QueryModule } from 'src/query/query.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Tag', schema: TagSchema }]),
    QueryModule,
    forwardRef(() => StoryModule),
  ],
  providers: [TagService, TagResolver],
  exports: [TagService],
})
export class TagModule {}
