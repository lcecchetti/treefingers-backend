import { ConflictException, Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { UserConnectionArgs } from './args/user-connection.args';
import { UserConnection } from './dto/user-connection.dto';
import { FilterUserInput } from './inputs/filter-user.input';
import { PaginationService } from 'src/pagination/pagination.service';
import { EditUserDataInput } from './inputs/edit-user.input';
import * as bcrypt from 'bcrypt';
import { CreateUserInputData } from './inputs/create-user.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QueryService } from 'src/query/query.service';
import { SortUserInput } from './inputs/sort-user.input';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private paginationService: PaginationService<User>,
    private queryService: QueryService<User>,
  ) {}

  async findById(id: number): Promise<User | null> {
    return this.findOne({ id: { eq: id } });
  }

  async findOne(filter?: FilterUserInput): Promise<User | null> {
    return this.prepareQueryBuilder(filter).getOne();
  }

  async findMany(filter?: FilterUserInput): Promise<User[]> {
    return this.prepareQueryBuilder(filter).getMany();
  }

  async create(data: CreateUserInputData): Promise<User> {
    // check if user already exists
    const existingEmail = await this.findOne({
      email: { eq: data.email },
    });
    if (existingEmail) {
      throw new ConflictException('Email already exists');
    }

    const existingUsername = await this.findOne({
      username: { eq: data.username },
    });
    if (existingUsername) {
      throw new ConflictException('Username already exists');
    }

    return this.userRepository.save(data);
  }

  async edit(userId: number, data: EditUserDataInput): Promise<User> {
    if (data.password) {
      data.password = await this.encryptPassword(data.password);
    }

    return await this.userRepository.save({
      userId,
      ...data,
    });
  }

  async paginate({
    filter,
    sort,
    ...connectionArgs
  }: UserConnectionArgs): Promise<UserConnection> {
    return this.paginationService.paginate(
      this.prepareQueryBuilder(filter, sort),
      sort,
      connectionArgs,
    );
  }

  prepareQueryBuilder(
    filter: FilterUserInput = new FilterUserInput(),
    sort: SortUserInput = new SortUserInput(),
  ) {
    /*filter.isActive = false;
    if (!filter.isActive === false) {
      filter.isActive = true;
    }*/

    return this.queryService.prepareQueryBuilder(
      this.userRepository,
      filter,
      sort,
    );
  }

  async encryptPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }
}
