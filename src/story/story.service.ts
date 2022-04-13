import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Story, StoryDocument } from './story.entity';
import { FilterQuery, Model } from 'mongoose';
import { StoryConnectionArgs } from './args/story-connection.args';
import { CreateStoryDataInput } from './inputs/create-story.input';
import { StoryConnection } from './dto/story-connection.dto';
import { FilterStoryInput } from './inputs/filter-story.input';
import { PaginationService } from 'src/pagination/pagination.service';
import { FilterService } from 'src/filter/filter.service';

@Injectable()
export class StoryService {
  constructor(
    @InjectModel('Story') private storyModel: Model<StoryDocument>,
    private paginationService: PaginationService<Story, StoryDocument>,
    private filterService: FilterService<StoryDocument>,
  ) {}

  async findById(_id: string): Promise<Story | null> {
    return this.storyModel.findById(_id).lean();
  }

  async findOne(filter?: FilterStoryInput): Promise<Story | null> {
    return this.storyModel.findOne(this.prepareFilter(filter)).lean();
  }

  async create(data: CreateStoryDataInput): Promise<Story | null> {
    // populate parent based fields
    let root;
    if (data.parent) {
      const parent = await this.findById(data.parent);
      root = parent.root || parent._id;
      data.forest = undefined;
    }

    return this.storyModel.create({
      ...data,
      root,
    });
  }

  async paginate(
    {
      filter,
      sort,
      ...connectionArgs
    }: StoryConnectionArgs = new StoryConnectionArgs(),
  ): Promise<StoryConnection> {
    return this.paginationService.paginate(
      this.storyModel,
      this.prepareFilter(filter),
      sort,
      connectionArgs,
    );
  }

  async count(filter?: FilterStoryInput): Promise<number> {
    return this.storyModel.count(this.prepareFilter(filter));
  }

  prepareFilter({ query, ...filter }: FilterStoryInput): FilterQuery<Comment> {
    const preparedFilter = this.filterService.prepareFilter(filter);

    // add search query condition if provided
    if (query) {
      preparedFilter.$or = [
        { $text: { $search: query } },
        { tags: { $regex: query, $options: 'i' } },
      ];
    }

    return preparedFilter;
  }
}
