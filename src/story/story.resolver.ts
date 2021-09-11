import { Resolver, Query, Args } from '@nestjs/graphql';
import { StoryService } from './story.service';
import { StoryConnection } from './story.connection';
import { ConnectionInput } from '../pagination/pagination.dto';
@Resolver()
export class StoryResolver {
  constructor(private storyService: StoryService) {}

  @Query(returns => StoryConnection)
  async stories(@Args() args: ConnectionInput): Promise<StoryConnection> {
    return this.storyService.paginate(args);
  }
}
