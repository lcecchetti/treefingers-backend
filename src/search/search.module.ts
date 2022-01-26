import { Module } from '@nestjs/common';
import { SearchResolver } from './search.resolver';
import { UserModule } from 'src/user/user.module';
import { ForestModule } from 'src/forest/forest.module';
import { StoryModule } from 'src/story/story.module';

@Module({
  imports: [UserModule, ForestModule, StoryModule],
  providers: [SearchResolver],
})
export class SearchModule {}
