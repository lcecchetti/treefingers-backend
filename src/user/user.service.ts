import { Model, FilterQuery, QueryOptions } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.entity';
import { PaginationService } from 'src/pagination/pagination.service';
import { UserConnection } from './user.connection';
import { RegisterInput } from 'src/auth/dto/register.input';
import { UsersInput } from './dto/users.input';

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

  async paginate(input: UsersInput): Promise<UserConnection> {
    return this.paginationService.paginate<User>(this.userModel, input);
  }

  async create(registerInput: RegisterInput): Promise<User> {
    return this.userModel.create(registerInput);
  }
}
