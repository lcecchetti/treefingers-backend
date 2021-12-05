import { Model, FilterQuery, QueryOptions } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.entity';
import { PaginationService } from 'src/pagination/pagination.service';
import { RegisterInput } from 'src/auth/dto/register.input';
import { UsersInput } from './dto/users.input';
import { UsersPaginated } from './users.paginated';

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
  ): Promise<User | undefined> {
    return this.userModel.findOne(filter, projection, options).lean();
  }

  async findById(
    _id: string,
    projection?: any | null,
    options?: QueryOptions,
  ): Promise<User | undefined> {
    return this.userModel.findById(_id, projection, options).lean();
  }

  async paginate(input: UsersInput): Promise<UsersPaginated> {
    return this.paginationService.paginate<User>(this.userModel, input);
  }

  async create(registerInput: RegisterInput): Promise<User> {
    return this.userModel.create(registerInput);
  }
}
