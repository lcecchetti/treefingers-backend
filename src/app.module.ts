import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StoryModule } from './story/story.module';

@Module({
  imports: [StoryModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
