import {
  Model,
  FilterQuery,
  QueryOptions,
  UpdateQuery,
  UpdateWriteOpResult,
} from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.entity';
import { DeleteResult } from 'mongodb';
import { CreateUserDataInput } from './dto/create-user.input';
import { QueryService } from 'src/query/query.service';

@Injectable()
export class UserService extends QueryService<User, UserDocument> {
  constructor(@InjectModel('User') private userModel: Model<UserDocument>) {
    super(userModel);
  }

  async findAll(
    filter?: FilterQuery<UserDocument>,
    projection?: any | null,
    options?: QueryOptions,
  ): Promise<User[]> {
    return this.userModel.find(filter, projection, options).lean();
  }

  async findOne(
    filter?: FilterQuery<UserDocument>,
    projection?: any | null,
    options?: QueryOptions,
  ): Promise<User | null> {
    return this.userModel.findOne(filter, projection, options).lean();
  }

  async findById(
    _id: string,
    projection?: any | null,
    options?: QueryOptions,
  ): Promise<User | null> {
    return this.userModel.findById(_id, projection, options).lean();
  }

  async create(input: CreateUserDataInput): Promise<User> {
    return this.userModel.create(input);
  }

  async count(filter?: FilterQuery<UserDocument>): Promise<number> {
    return this.userModel.count(filter);
  }

  async deleteOne(
    filter?: FilterQuery<UserDocument>,
    options?: QueryOptions,
  ): Promise<DeleteResult> {
    return this.userModel.deleteOne(filter, options);
  }

  async deleteMany(
    filter?: FilterQuery<UserDocument>,
    options?: QueryOptions,
  ): Promise<DeleteResult> {
    return this.userModel.deleteMany(filter, options);
  }

  async updateOne(
    filter?: FilterQuery<UserDocument>,
    update?: UpdateQuery<UserDocument>,
    options?: QueryOptions,
  ): Promise<UpdateWriteOpResult> {
    return this.userModel.updateOne(filter, update, options);
  }

  async updateMany(
    filter?: FilterQuery<UserDocument>,
    update?: UpdateQuery<UserDocument>,
    options?: QueryOptions,
  ): Promise<UpdateWriteOpResult> {
    return this.userModel.updateMany(filter, update, options);
  }
}
