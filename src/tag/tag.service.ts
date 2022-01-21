import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Tag, TagDocument } from './tag.entity';
import { QueryService } from 'src/query/query.service';
import { Model } from 'mongoose';
import { TagConnectionArgs } from './args/tag-connection.args';
import { CreateTagInput } from './inputs/create-tag.input';
import { TagConnection } from './dto/tag-connection.dto';
import { FilterTagInput } from './inputs/filter-tag.input';
import { SearchArgs } from 'src/search/args/search.args';
import slugify from 'slugify';

@Injectable()
export class TagService {
  constructor(
    @InjectModel('Tag') private tagModel: Model<TagDocument>,
    private queryService: QueryService<Tag, TagDocument>,
  ) {}

  async findById(_id: string): Promise<Tag | null> {
    return this.tagModel.findById(_id).lean();
  }

  async findOne(filter?: FilterTagInput): Promise<Tag | null> {
    return this.tagModel
      .findOne(this.queryService.gqlFilterToMongo(filter))
      .lean();
  }

  async findMany(filter?: FilterTagInput): Promise<Tag[]> {
    return this.tagModel
      .find(this.queryService.gqlFilterToMongo(filter))
      .lean();
  }

  async create({ data }: CreateTagInput): Promise<Tag> {
    const slug = slugify(data.label, {
      lower: true,
    });

    return this.tagModel.create({
      ...data,
      slug,
    });
  }

  async findOrCreate(label: string): Promise<Tag> {
    const tag = await this.tagModel.findOne({ label });
    if (tag) {
      return tag;
    }

    return this.create({ data: { label } });
  }

  async prepareStoryTags(labels: string[] = []): Promise<Tag[]> {
    return Promise.all(
      labels.map(function async(label) {
        return this.findOrCreate(label);
      }, this),
    );
  }

  async updateStoriesCount(tags: string[], amount: number) {
    return this.tagModel.updateMany(
      { label: { $in: tags } },
      { $inc: { storiesCount: amount } },
    );
  }

  async paginate(
    { filter, sort, pagination }: TagConnectionArgs = new TagConnectionArgs(),
  ): Promise<TagConnection> {
    return this.queryService.paginate(
      this.tagModel,
      this.queryService.gqlFilterToMongo(filter),
      sort,
      pagination,
    );
  }

  async search({ query, pagination }: SearchArgs): Promise<TagConnection> {
    return await this.queryService.paginate(
      this.tagModel,
      { $text: { $search: query } },
      null,
      pagination,
    );
  }
}
