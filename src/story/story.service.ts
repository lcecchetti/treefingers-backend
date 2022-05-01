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
import { ForestService } from 'src/forest/forest.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class StoryService {
  constructor(
    @InjectModel('Story') private storyModel: Model<StoryDocument>,
    private forestService: ForestService,
    private userService: UserService,
    private paginationService: PaginationService<Story, StoryDocument>,
    private filterService: FilterService<StoryDocument>,
  ) {}

  async findById(_id: string): Promise<Story | null> {
    return this.storyModel.findById(_id).lean();
  }

  async findOne(filter?: FilterStoryInput): Promise<Story | null> {
    return this.storyModel.findOne(this.prepareFilter(filter)).lean();
  }

  async findMany(filter?: FilterStoryInput): Promise<Story[]> {
    return this.storyModel.find(this.prepareFilter(filter)).lean();
  }

  async create(data: CreateStoryDataInput): Promise<Story | null> {
    // populate parent based fields
    let root;
    if (data.parent) {
      const parent = await this.findById(data.parent);
      root = parent.root || parent._id;
      data.forest = undefined;
    }

    const story = await this.storyModel.create({
      ...data,
      root,
    });

    // update user stories count
    await this.userService.updateStoriesCount(data.author, 1);

    // update forest stories count
    await this.forestService.updateStoriesCount(data.forest, 1);

    // update parent children count
    if (story.parent) {
      await this.updateChildrenCount(story.parent._id, 1);
    }

    // update root descendents count
    if (story.root) {
      await this.updateDescendantsCount(story.root._id, 1);
    }

    return story;
  }

  async updateLikesCount(_id: string, modifier: number): Promise<Story> {
    const filter = { _id };

    // safe check to avoid negative numbers
    if (modifier < 0) {
      filter['likesCount'] = { $gt: 0 };
    }

    return this.storyModel.findOneAndUpdate(filter, {
      $inc: { likesCount: modifier },
    });
  }

  async updateCommentsCount(_id: string, modifier: number): Promise<Story> {
    const filter = { _id };

    // safe check to avoid negative numbers
    if (modifier < 0) {
      filter['commentsCount'] = { $gt: 0 };
    }

    return this.storyModel.findOneAndUpdate(filter, {
      $inc: { commentsCount: modifier },
    });
  }

  async updateChildrenCount(_id: string, modifier: number): Promise<Story> {
    const filter = { _id };

    // safe check to avoid negative numbers
    if (modifier < 0) {
      filter['childrenCount'] = { $gt: 0 };
    }

    return this.storyModel.findOneAndUpdate(filter, {
      $inc: { childrenCount: modifier },
    });
  }

  async updateDescendantsCount(_id: string, modifier: number): Promise<Story> {
    const filter = { _id };

    // safe check to avoid negative numbers
    if (modifier < 0) {
      filter['descendantsCount'] = { $gt: 0 };
    }

    return this.storyModel.findOneAndUpdate(filter, {
      $inc: { descendantsCount: modifier },
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
