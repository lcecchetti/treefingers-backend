import { FilterQuery, Model, QueryOptions } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Like, LikeDocument } from './like.entity';
import { CreateLikeDataInput } from './dto/create-like.input';

@Injectable()
export class LikeService {
  constructor(@InjectModel(Like.name) private likeModel: Model<LikeDocument>) {}

  async findById(
    _id: string,
    projection?: any | null,
    options?: QueryOptions,
  ): Promise<Like | null> {
    return this.likeModel.findById(_id, projection, options).lean();
  }

  async findOne(
    filter?: FilterQuery<LikeDocument>,
    projection?: any | null,
    options?: QueryOptions,
  ): Promise<Like | null> {
    return this.likeModel.findOne(filter, projection, options).lean();
  }

  async findAll(
    filter?: FilterQuery<LikeDocument>,
    projection?: any | null,
    options?: QueryOptions,
  ): Promise<Like[]> {
    return this.likeModel.find(filter, projection, options).lean();
  }

  async create(input: CreateLikeDataInput): Promise<Like> {
    return this.likeModel.create(input);
  }
}
