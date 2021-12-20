import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TagService } from './tag.service';
import { TagResolver } from './tag.resolver';
import { Tag, TagSchema } from './tag.entity';
import { StoryModule } from 'src/story/story.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Tag.name, schema: TagSchema }]),
    forwardRef(() => StoryModule),
  ],
  providers: [TagService, TagResolver],
  exports: [TagService],
})
export class TagModule {}
