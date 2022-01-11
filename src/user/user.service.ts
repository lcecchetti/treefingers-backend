import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.entity';
import { QueryService } from 'src/query/query.service';
import { Model, UpdateWriteOpResult } from 'mongoose';
import { UserFilterInput } from './dto/user-filter.input';
import { CreateUserDataInput } from './dto/create-user.input';
import { DeleteResult } from 'mongodb';
import { UpdateUserDataInput } from './dto/update-user.input';
import { UserConnectionArgs } from './args/user-connection.args';
import { UserConnection } from './dto/user.connection';
@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private userModel: Model<UserDocument>,
    private queryService: QueryService<User, UserDocument>,
  ) {}

  async findById(_id: string): Promise<User | null> {
    return this.userModel.findById(_id).lean();
  }

  async findOne(filter?: UserFilterInput): Promise<User | null> {
    return this.userModel
      .findOne(this.queryService.gqlFilterToMongo(filter))
      .lean();
  }

  async findAll(filter?: UserFilterInput): Promise<User[]> {
    return this.userModel
      .find(this.queryService.gqlFilterToMongo(filter))
      .lean();
  }

  async register(data: CreateUserDataInput): Promise<User> {
    return this.userModel.create(data);
  }

  async deleteOne(filter?: UserFilterInput): Promise<DeleteResult> {
    return this.userModel.deleteOne(this.queryService.gqlFilterToMongo(filter));
  }

  async deleteMany(filter?: UserFilterInput): Promise<DeleteResult> {
    return this.userModel.deleteMany(
      this.queryService.gqlFilterToMongo(filter),
    );
  }

  async updateOne(
    filter?: UserFilterInput,
    update?: UpdateUserDataInput,
  ): Promise<UpdateWriteOpResult> {
    return this.userModel.updateOne(
      this.queryService.gqlFilterToMongo(filter),
      update,
    );
  }

  async updateMany(
    filter?: UserFilterInput,
    update?: UpdateUserDataInput,
  ): Promise<UpdateWriteOpResult> {
    return this.userModel.updateMany(
      this.queryService.gqlFilterToMongo(filter),
      update,
    );
  }

  async paginate(args: UserConnectionArgs): Promise<UserConnection> {
    return this.queryService.paginate(this.userModel, args);
  }
}
