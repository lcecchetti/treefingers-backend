import { Args, Query, Resolver } from '@nestjs/graphql';
import { StoryService } from 'src/story/story.service';
import { TagService } from 'src/tag/tag.service';
import { UserService } from 'src/user/user.service';
import { SearchArgs } from './args/search.args';
import { SearchResults } from './dto/search-results.dto';

@Resolver()
export class SearchResolver {
  constructor(
    private storyService: StoryService,
    private userService: UserService,
    private tagService: TagService,
  ) {}

  @Query(() => SearchResults)
  async search(
    @Args() args: SearchArgs = new SearchArgs(),
  ): Promise<SearchResults> {
    return {
      stories: await this.storyService.search(args),
      authors: await this.userService.search(args),
      tags: await this.tagService.search(args),
    };
  }
}
