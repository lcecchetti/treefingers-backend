import { Resolver, Query } from '@nestjs/graphql';

@Resolver()
export class StoryResolver {
  @Query(() => String)
  async hello() {
    return '👋';
  }
}
