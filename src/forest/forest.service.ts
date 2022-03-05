import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Forest, ForestDocument } from './forest.entity';
import { QueryService } from 'src/query/query.service';
import { FilterQuery, Model } from 'mongoose';
import { ForestConnectionArgs } from './args/forest-connection.args';
import { CreateForestInput } from './inputs/create-forest.input';
import { ForestConnection } from './dto/forest-connection.dto';
import { FilterForestInput } from './inputs/filter-forest.input';
import slugify from 'slugify';

@Injectable()
export class ForestService {
  constructor(
    @InjectModel('Forest') private forestModel: Model<ForestDocument>,
    private queryService: QueryService<Forest, ForestDocument>,
  ) {}

  async findById(_id: string): Promise<Forest | null> {
    return this.forestModel.findById(_id).lean();
  }

  async findOne(filter?: FilterForestInput): Promise<Forest | null> {
    return this.forestModel
      .findOne(this.queryService.gqlFilterToMongo(filter))
      .lean();
  }

  async create({ data }: CreateForestInput): Promise<Forest> {
    // check if forest already exists
    const slug = slugify(data.name, {
      lower: true,
    });
    const existingSlug = await this.forestModel.findOne({ slug });
    if (existingSlug) {
      throw new ConflictException('Forest with same name already exists');
    }

    return this.forestModel.create({
      ...data,
      slug,
    });
  }

  async paginate(
    {
      filter,
      sort,
      ...connectionArgs
    }: ForestConnectionArgs = new ForestConnectionArgs(),
  ): Promise<ForestConnection> {
    const mongoFilter: FilterQuery<Forest> =
      this.queryService.gqlFilterToMongo(filter);

    // add search query condition if provided
    if (filter.query) {
      mongoFilter.$text = { $search: filter.query };
      delete mongoFilter.query;
    }

    return this.queryService.paginate(
      this.forestModel,
      mongoFilter,
      sort,
      connectionArgs,
    );
  }

  async count(filter?: FilterForestInput): Promise<number> {
    return this.forestModel.count(this.queryService.gqlFilterToMongo(filter));
  }
}
