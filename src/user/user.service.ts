import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.entity';
import { FilterQuery, Model } from 'mongoose';
import { UserConnectionArgs } from './args/user-connection.args';
import { UserConnection } from './dto/user-connection.dto';
import { FilterUserInput } from './inputs/filter-user.input';
import { RegisterDataInput } from 'src/auth/inputs/register.input';
import { PaginationService } from 'src/pagination/pagination.service';
import { FilterService } from 'src/filter/filter.service';
import { EditUserDataInput } from './inputs/edit-user.input';
import { AuthService } from 'src/auth/auth.service';
@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private userModel: Model<UserDocument>,
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
    private paginationService: PaginationService<User, UserDocument>,
    private filterService: FilterService<UserDocument>,
  ) {}

  async findById(_id: string): Promise<User | null> {
    return this.userModel.findById(_id).lean();
  }

  async findOne(filter?: FilterUserInput): Promise<User | null> {
    return this.userModel.findOne(this.prepareFilter(filter)).lean();
  }

  async findMany(filter?: FilterUserInput): Promise<User[]> {
    return this.userModel.find(this.prepareFilter(filter)).lean();
  }

  async register(data: RegisterDataInput): Promise<User> {
    // check if user already exists
    const existingEmail = await this.userModel.findOne({ email: data.email });
    if (existingEmail) {
      throw new ConflictException('Email already exists');
    }

    const existingUsername = await this.userModel.findOne({
      username: data.username,
    });
    if (existingUsername) {
      throw new ConflictException('Username already exists');
    }

    return this.userModel.create(data);
  }

  async edit(user: string, data: EditUserDataInput): Promise<User> {
    if (data.password) {
      data.password = await this.authService.encryptPassword(data.password);
    }

    return await this.userModel.findByIdAndUpdate(user, data);
  }

  async paginate(
    {
      filter,
      sort,
      ...connectionArgs
    }: UserConnectionArgs = new UserConnectionArgs(),
  ): Promise<UserConnection> {
    return this.paginationService.paginate(
      this.userModel,
      this.prepareFilter(filter),
      sort,
      connectionArgs,
    );
  }

  async count(filter?: FilterUserInput): Promise<number> {
    return this.userModel.count(this.prepareFilter(filter));
  }

  prepareFilter({ query, ...filter }: FilterUserInput): FilterQuery<Comment> {
    const preparedFilter = this.filterService.prepareFilter(filter);

    // add search query condition if provided
    if (query) {
      preparedFilter.$or = [
        { $text: { $search: query } },
        { username: { $regex: query, $options: 'i' } },
      ];
    }

    return preparedFilter;
  }
}
