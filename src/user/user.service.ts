import { Model, FilterQuery, QueryOptions } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.entity';
import { PaginationService } from 'src/pagination/pagination.service';
import { UsersInput } from './dto/users.input';
import { UsersPaginated } from './users.paginated';
import { UserCreateInput } from './dto/user-create.input';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private paginationService: PaginationService,
  ) {}

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

  async paginate(input: UsersInput): Promise<UsersPaginated> {
    return this.paginationService.paginate<User>(this.userModel, input);
  }

  async create(input: UserCreateInput): Promise<User> {
    return this.userModel.create(input);
  }
}
