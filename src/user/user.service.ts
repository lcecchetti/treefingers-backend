import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.entity';
import { QueryService } from 'src/query/query.service';
import { Model } from 'mongoose';
import { UserConnectionArgs } from './args/user-connection.args';
import { UserConnection } from './dto/user-connection.dto';
import { FilterUserInput } from './inputs/filter-user.input';
import slugify from 'slugify';
import { RegisterInput } from 'src/auth/inputs/register.input';
import { SearchArgs } from 'src/search/args/search.args';
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

  async register({ data }: RegisterInput): Promise<User> {
    // check if user already exists
    const existingEmail = await this.userModel.findOne({ email: data.email });
    if (existingEmail) {
      throw new ConflictException('Email already exists');
    }

    // check if user already exists
    const username = slugify(data.pseudonym, {
      lower: true,
    });
    const existingUsername = await this.userModel.findOne({ username });
    if (existingUsername) {
      throw new ConflictException('Pseudonym already exists');
    }

    return this.userModel.create({
      ...data,
      username,
    });
  }

  async paginate(
    {
      filter,
      ...connectionArgs
    }: UserConnectionArgs = new UserConnectionArgs(),
  ): Promise<UserConnection> {
    return this.queryService.paginate(
      this.userModel,
      this.queryService.gqlFilterToMongo(filter),
      null,
      connectionArgs,
    );
  }

  async search({
    query,
    ...connectionArgs
  }: SearchArgs): Promise<UserConnection> {
    return this.queryService.paginate(
      this.userModel,
      { $text: { $search: query } },
      undefined,
      connectionArgs,
    );
  }

  async count(filter?: FilterUserInput): Promise<number> {
    return this.userModel.count(this.queryService.gqlFilterToMongo(filter));
  }
}
