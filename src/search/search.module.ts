import { Module } from '@nestjs/common';
import { SearchResolver } from './search.resolver';
import { UserModule } from 'src/user/user.module';
import { TagModule } from 'src/tag/tag.module';
import { StoryModule } from 'src/story/story.module';

@Module({
  imports: [UserModule, TagModule, StoryModule],
  providers: [SearchResolver],
})
export class SearchModule {}
