import { Model, FilterQuery, QueryOptions } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.entity';
import { PaginationService } from '../pagination/pagination.service';
import { ConnectionInput } from '../pagination/pagination.dto';
import { UserConnection } from './user.connection';

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
    return this.userModel.find(filter, projection, options).exec();
  }

  async findById(id: string): Promise<User | undefined> {
    return this.userModel.findById(id).exec();
  }

  async findOne(
    filter?: FilterQuery<UserDocument>,
    projection?: any | null,
    options?: QueryOptions,
  ): Promise<User | undefined> {
    return this.userModel.findOne(filter, projection, options).exec();
  }

  async findOneByEmail(email: string): Promise<User | undefined> {
    return this.findOne({ email });
  }

  async paginate(input: ConnectionInput): Promise<UserConnection> {
    return this.paginationService.paginate<User>(this.userModel, input);
  }
}
