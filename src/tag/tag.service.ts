import { FilterQuery, Model, QueryOptions } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Tag, TagDocument } from './tag.entity';
import { PaginationService } from 'src/pagination/pagination.service';
import { TagsPaginated } from './tags.paginated';
import { ConnectionInput } from 'src/pagination/dto/connection.input';
import { CreateTagInput } from './dto/create-tag.input';

@Injectable()
export class TagService {
  constructor(
    @InjectModel(Tag.name) private tagModel: Model<TagDocument>,
    private paginationService: PaginationService,
  ) {}

  async findById(
    _id: string,
    projection?: any | null,
    options?: QueryOptions,
  ): Promise<Tag | null> {
    return this.tagModel.findById(_id, projection, options).lean();
  }

  async findOne(
    filter?: FilterQuery<TagDocument>,
    projection?: any | null,
    options?: QueryOptions,
  ): Promise<Tag | null> {
    return this.tagModel.findOne(filter, projection, options).lean();
  }

  async findAll(
    filter?: FilterQuery<TagDocument>,
    projection?: any | null,
    options?: QueryOptions,
  ): Promise<Tag[]> {
    return this.tagModel.find(filter, projection, options).lean();
  }

  async paginate(connectionInput: ConnectionInput): Promise<TagsPaginated> {
    return this.paginationService.paginate<Tag>(this.tagModel, connectionInput);
  }

  async create(input: CreateTagInput): Promise<Tag> {
    return this.tagModel.create(input);
  }
}
