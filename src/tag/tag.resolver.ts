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
import { TagInput } from 'src/tag/dto/tag.input';
import { TagConnection } from './dto/tag.connection';
import { TagConnectionInput } from './dto/tag-connection.input';
import { StoryConnection } from 'src/story/dto/story.connection';
import { StoryConnectionInput } from 'src/story/dto/story-connection.input';

@Resolver(() => Tag)
export class TagResolver {
  constructor(
    private tagService: TagService,
    private storyService: StoryService,
  ) {}

  @Query(() => TagConnection)
  async tags(
    @Args('input', { nullable: true })
    input: TagConnectionInput = new TagConnectionInput(),
  ): Promise<TagConnection> {
    return this.tagService.paginate(input);
  }

  @Query(() => Tag, { nullable: true })
  async tag(
    @Args('input', { nullable: true }) { filter }: TagInput = new TagInput(),
  ): Promise<Tag> {
    return this.tagService.findOne(filter);
  }

  @Mutation(() => CreateTagPayload)
  async createStory(
    @Args('input') input: CreateTagInput,
  ): Promise<CreateTagPayload> {
    return { tag: await this.tagService.create(input) };
  }

  @ResolveField(() => StoryConnection)
  async stories(
    @Args('input', { nullable: true })
    input: StoryConnectionInput = new StoryConnectionInput(),
    @Parent() tag: Tag,
  ): Promise<StoryConnection> {
    //@todo support multiple tags per story
    input.filter.tag = tag._id;
    return this.storyService.paginate(input);
  }
}
