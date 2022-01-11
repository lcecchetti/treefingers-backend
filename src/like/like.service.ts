import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Like, LikeDocument } from './like.entity';
import { QueryService } from 'src/query/query.service';
import { LikeFilterInput } from './dto/like-filter.input';
import { CreateLikeDataInput } from './dto/create-like.input';
import { DeleteResult } from 'mongodb';

@Injectable()
export class LikeService {
  constructor(
    @InjectModel('Like') private likeModel: Model<LikeDocument>,
    private queryService: QueryService<Like, LikeDocument>,
  ) {}

  async findById(_id: string): Promise<Like | null> {
    return this.likeModel.findById(_id).lean();
  }

  async findOne(filter?: LikeFilterInput): Promise<Like | null> {
    return this.likeModel
      .findOne(this.queryService.gqlFilterToMongo(filter))
      .lean();
  }

  async create(data: CreateLikeDataInput): Promise<Like> {
    return this.likeModel.create(data);
  }

  async count(filter?: LikeFilterInput): Promise<number> {
    return this.likeModel.count(this.queryService.gqlFilterToMongo(filter));
  }

  async deleteOne(filter?: LikeFilterInput): Promise<DeleteResult> {
    return this.likeModel.deleteOne(this.queryService.gqlFilterToMongo(filter));
  }
}
