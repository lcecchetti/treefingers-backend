import { Resolver, Query, Args } from '@nestjs/graphql';
import { StoryService } from './story.service';
import { StoryConnection } from './story.connection';
import { ConnectionInput } from 'src/pagination/dto/connection.input';
@Resolver()
export class StoryResolver {
  constructor(private storyService: StoryService) {}

  @Query(() => StoryConnection)
  async stories(
    @Args('input', { nullable: true }) input: ConnectionInput,
  ): Promise<StoryConnection> {
    return this.storyService.paginate(input);
  }
}
