import { Resolver, Query } from '@nestjs/graphql';
import { StoryService } from './story.service';
import { Story } from './story.model';

@Resolver()
export class StoryResolver {
  constructor(private readonly storyService: StoryService) {}

  @Query(() => [Story])
  async stories() {
    return this.storyService.findAll();
  }
}
