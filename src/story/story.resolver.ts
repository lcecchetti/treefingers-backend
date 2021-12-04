import { Resolver, Query, Args, ResolveField, Parent } from '@nestjs/graphql';
import { StoryService } from './story.service';
import { StoryConnection } from './story.connection';
import { ConnectionInput } from 'src/pagination/dto/connection.input';
import { Story } from './story.entity';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/user.entity';
@Resolver(() => Story)
export class StoryResolver {
  constructor(
    private storyService: StoryService,
    private userService: UserService,
  ) {}

  @Query(() => StoryConnection)
  async stories(
    @Args('input', { nullable: true }) input: ConnectionInput,
  ): Promise<StoryConnection> {
    return this.storyService.paginate(input);
  }

  @ResolveField(() => User)
  async author(@Parent() story: Story): Promise<User> {
    return this.userService.findById(story.author._id);
  }
}
