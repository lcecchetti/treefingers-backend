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
import { TagsInput } from './dto/tags.input';
import { TagsPaginated } from './tags.paginated';
import { CreateTagPayload } from './dto/create-tag.payload';
import { CreateTagInput } from './dto/create-tag.input';
import { StoriesPaginated } from 'src/story/stories.paginated';
import { StoriesInput } from 'src/story/dto/stories.input';
import { TagInput } from 'src/tag/dto/tag.input';

@Resolver(() => Tag)
export class TagResolver {
  constructor(
    private tagService: TagService,
    private storyService: StoryService,
  ) {}

  @Query(() => TagsPaginated)
  async tags(
    @Args('input', { nullable: true }) input: TagsInput = new TagsInput(),
  ): Promise<TagsPaginated> {
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

  @ResolveField(() => StoriesPaginated)
  async stories(
    @Args('input', { nullable: true }) input: StoriesInput = new StoriesInput(),
    @Parent() tag: Tag,
  ): Promise<StoriesPaginated> {
    //@todo support multiple tags per story
    input.filter.tag = tag._id;
    return this.storyService.paginate(input);
  }
}
