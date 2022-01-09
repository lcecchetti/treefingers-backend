import { Model, FilterQuery, QueryOptions } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.entity';
import { PaginationService } from 'src/common/pagination/pagination.service';
import { UserCreateDataInput } from './dto/user-create.input';

@Injectable()
export class UserService extends PaginationService<User, UserDocument> {
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

  async create(input: UserCreateDataInput): Promise<User> {
    return this.userModel.create(input);
  }
}
