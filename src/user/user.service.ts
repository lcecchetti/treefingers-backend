import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.entity';
import { QueryService } from 'src/query/query.service';
import { Model } from 'mongoose';
import { UserConnectionArgs } from './args/user-connection.args';
import { CreateUserDataInput } from './inputs/create-user.input';
import { DeleteResultPayload } from 'src/query/payloads/delete-result.payload';
import { UpdateUserDataInput } from './inputs/update-user.input';
import { UpdateResultPayload } from 'src/query/payloads/update-result.payload';
import { UserConnection } from './dto/user-connection.dto';
import { FilterUserInput } from './inputs/filter-user.input';
import slugify from 'slugify';
@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private userModel: Model<UserDocument>,
    private queryService: QueryService<User, UserDocument>,
  ) {}

  async findById(_id: string): Promise<User | null> {
    return this.userModel.findById(_id).lean();
  }

  async findOne(filter?: FilterUserInput): Promise<User | null> {
    return this.userModel
      .findOne(this.queryService.gqlFilterToMongo(filter))
      .lean();
  }

  async findMany(filter?: FilterUserInput): Promise<User[]> {
    return this.userModel
      .find(this.queryService.gqlFilterToMongo(filter))
      .lean();
  }

  async createOne(data: CreateUserDataInput): Promise<User> {
    data.username = slugify(data.pseudonym, {
      lower: true,
    });

    // check if user already exists
    const existingEmail = await this.findOne({
      email: { eq: data.email },
    });
    if (existingEmail) {
      throw new ConflictException('Email already exists');
    }

    // check if user already exists
    const existingUsername = await this.findOne({
      username: { eq: data.username },
    });
    if (existingUsername) {
      throw new ConflictException('Pseudonym already exists');
    }

    return this.userModel.create(data);
  }

  async deleteOne(filter?: FilterUserInput): Promise<User | null> {
    return this.userModel.findOneAndDelete(
      this.queryService.gqlFilterToMongo(filter),
    );
  }

  async deleteMany(filter?: FilterUserInput): Promise<DeleteResultPayload> {
    return this.userModel.deleteMany(
      this.queryService.gqlFilterToMongo(filter),
    );
  }

  async updateOne(
    filter?: FilterUserInput,
    update?: UpdateUserDataInput,
  ): Promise<User | null> {
    return this.userModel
      .findOneAndUpdate(this.queryService.gqlFilterToMongo(filter), update)
      .lean();
  }

  async updateMany(
    filter?: FilterUserInput,
    update?: UpdateUserDataInput,
  ): Promise<UpdateResultPayload> {
    return this.userModel.updateMany(
      this.queryService.gqlFilterToMongo(filter),
      update,
    );
  }

  async paginate(args: UserConnectionArgs): Promise<UserConnection> {
    return this.queryService.paginate(this.userModel, args);
  }

  async updateLikesCount(author: string, amount: number) {
    return this.userModel.updateOne(
      { _id: author },
      { $inc: { likesCount: amount } },
    );
  }
}
