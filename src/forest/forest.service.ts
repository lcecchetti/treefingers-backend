import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Forest, ForestDocument } from './forest.entity';
import { FilterQuery, Model } from 'mongoose';
import { ForestConnectionArgs } from './args/forest-connection.args';
import { CreateForestInput } from './inputs/create-forest.input';
import { ForestConnection } from './dto/forest-connection.dto';
import { FilterForestInput } from './inputs/filter-forest.input';
import slugify from 'slugify';
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

  async create({ data }: CreateForestInput): Promise<Forest> {
    // check if forest already exists
    const existingName = await this.forestModel.findOne({ name });
    if (existingName) {
      throw new ConflictException('Forest with same name already exists');
    }

    return this.forestModel.create(data);
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

  prepareFilter({ query, ...filter }: FilterForestInput): FilterQuery<Comment> {
    const preparedFilter = this.filterService.prepareFilter(filter);

    // add search query condition if provided
    if (query) {
      preparedFilter.$text = { $search: query };
    }

    return preparedFilter;
  }
}
