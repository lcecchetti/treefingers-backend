import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Forest, ForestDocument } from './forest.entity';
import { FilterQuery, Model } from 'mongoose';
import { ForestConnectionArgs } from './args/forest-connection.args';
import { CreateForestDataInput } from './inputs/create-forest.input';
import { ForestConnection } from './dto/forest-connection.dto';
import { FilterForestInput } from './inputs/filter-forest.input';
import { PaginationService } from 'src/pagination/pagination.service';
import { FilterService } from 'src/filter/filter.service';

@Injectable()
export class ForestService {
  constructor(
    @InjectModel('Forest') private forestModel: Model<ForestDocument>,
    private paginationService: PaginationService<Forest, ForestDocument>,
    private filterService: FilterService<ForestDocument>,
  ) {}

  async findById(_id: string): Promise<Forest | null> {
    return this.forestModel.findById(_id).lean();
  }

  async findOne(filter?: FilterForestInput): Promise<Forest | null> {
    return this.forestModel.findOne(this.prepareFilter(filter)).lean();
  }

  async findMany(filter?: FilterForestInput): Promise<Forest[]> {
    return this.forestModel.find(this.prepareFilter(filter)).lean();
  }

  async create(data: CreateForestDataInput): Promise<Forest> {
    const existingName = await this.forestModel.findOne({ name: data.name });
    if (existingName) {
      throw new ConflictException('Forest with same name already exists');
    }

    return this.forestModel.create(data);
  }

  async updateCommentsCount(_id: string, modifier: number): Promise<Forest> {
    const filter = { _id };

    // safe check to avoid negative numbers
    if (modifier < 0) {
      filter['commentsCount'] = { $gt: 0 };
    }

    return this.forestModel.findOneAndUpdate(filter, {
      $inc: { commentsCount: modifier },
    });
  }

  async paginate(
    {
      filter,
      sort,
      ...connectionArgs
    }: ForestConnectionArgs = new ForestConnectionArgs(),
  ): Promise<ForestConnection> {
    return this.paginationService.paginate(
      this.forestModel,
      this.prepareFilter(filter),
      sort,
      connectionArgs,
    );
  }

  async count(filter?: FilterForestInput): Promise<number> {
    return this.forestModel.count(this.prepareFilter(filter));
  }

  async updateMembersCount(_id: string, modifier: number): Promise<Forest> {
    const filter = { _id };

    // safe check to avoid negative numbers
    if (modifier < 0) {
      filter['membersCount'] = { $gt: 0 };
    }

    return this.forestModel.findByIdAndUpdate(filter, {
      $inc: { membersCount: modifier },
    });
  }

  async updateStoriesCount(_id: string, modifier: number): Promise<Forest> {
    const filter = { _id };

    // safe check to avoid negative numbers
    if (modifier < 0) {
      filter['storiesCount'] = { $gt: 0 };
    }

    return this.forestModel.findByIdAndUpdate(filter, {
      $inc: { storiesCount: modifier },
    });
  }

  prepareFilter({ query, ...filter }: FilterForestInput): FilterQuery<Comment> {
    const preparedFilter = this.filterService.prepareFilter(filter);

    // add search query condition if provided
    if (query) {
      preparedFilter.$or = [
        { $text: { $search: query } },
        { name: { $regex: query, $options: 'i' } },
      ];
    }

    return preparedFilter;
  }
}
