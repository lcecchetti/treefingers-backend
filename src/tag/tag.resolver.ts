import {
  Resolver,
  Query,
  Args,
  ResolveField,
  Parent,
  Mutation,
} from '@nestjs/graphql';
import { TagService } from './tag.service';
import { Tag } from './tag.entity';
import { StoryService } from 'src/story/story.service';
import { CreateTagPayload } from './dto/create-tag.payload';
import { CreateTagInput } from './dto/create-tag.input';
import { TagConnection } from './dto/tag.connection';
import { StoryConnection } from 'src/story/dto/story.connection';
import { TagFilterInput } from './dto/tag-filter.input';
import { TagConnectionArgs } from './args/tag-connection.args';
import { StoryConnectionArgs } from 'src/comment/args/comment-connection.args';

@Resolver(() => Tag)
export class TagResolver {
  constructor(
    private tagService: TagService,
    private storyService: StoryService,
  ) {}

  @Query(() => TagConnection)
  async tags(
    @Args({ nullable: true })
    args: TagConnectionArgs = new TagConnectionArgs(),
  ): Promise<TagConnection> {
    return this.tagService.paginate(args);
  }

  @Query(() => Tag, { nullable: true })
  async tag(
    @Args('filter', { nullable: true })
    filter: TagFilterInput = new TagFilterInput(),
  ): Promise<Tag> {
    return this.tagService.findOne(filter);
  }

  @Mutation(() => CreateTagPayload)
  async createTag(
    @Args('input') input: CreateTagInput,
  ): Promise<CreateTagPayload> {
    return { tag: await this.tagService.create(input.data) };
  }

  @ResolveField(() => StoryConnection)
  async stories(
    @Args({ nullable: true })
    args: StoryConnectionArgs = new StoryConnectionArgs(),
    @Parent() tag: Tag,
  ): Promise<StoryConnection> {
    //@todo support multiple tags per story
    args.filter.tag = tag._id;
    return this.storyService.paginate(args);
  }
}
