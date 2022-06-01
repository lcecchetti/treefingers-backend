import { ConflictException, Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { UserConnectionArgs } from './args/user-connection.args';
import { UserConnection } from './dto/user-connection.dto';
import { FilterUserInput } from './inputs/filter-user.input';
import { PaginationService } from '../pagination/pagination.service';
import { EditUserDataInput } from './inputs/edit-user.input';
import * as bcrypt from 'bcrypt';
import { CreateUserInputData } from './inputs/create-user.input';
import { QueryService } from '../query/query.service';
import { SortUserInput } from './inputs/sort-user.input';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { wrap } from '@mikro-orm/core';
import { CurrentUser } from '../auth/dto/current-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: EntityRepository<User>,
    private paginationService: PaginationService<User>,
    private queryService: QueryService<User>,
  ) {}

  async findOne(filter?: FilterUserInput): Promise<User | null> {
    return this.prepareQueryBuilder(filter).getSingleResult();
  }

  async findMany(filter?: FilterUserInput): Promise<User[]> {
    return this.prepareQueryBuilder(filter).getResult();
  }

  async findById(id: number): Promise<User | null> {
    return this.findOne({ id: { eq: id } });
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

    const user = await this.userRepository.create({
      ...data,
      password: await this.encryptPassword(data.password),
    });

    await this.userRepository.persistAndFlush(user);
    return user;
  }

  async edit(userId: number, data: EditUserDataInput): Promise<User> {
    if (data.password) {
      data.password = await this.encryptPassword(data.password);
    } else {
      delete data.password;
    }

    const user = await this.findById(userId);
    wrap(user).assign(data);
    await this.userRepository.persistAndFlush(user);
    return user;
  }

  async paginate(
    { filter, sort, ...connectionArgs }: UserConnectionArgs,
    currentUser?: CurrentUser,
  ): Promise<UserConnection> {
    return this.paginationService.paginate(
      this.prepareQueryBuilder(filter, sort, currentUser),
      sort,
      connectionArgs,
    );
  }

  prepareQueryBuilder(
    { query, followed, ...filter }: FilterUserInput = new FilterUserInput(),
    sort: SortUserInput = new SortUserInput(),
    currentUser?: CurrentUser,
  ) {
    // add isActive filter
    if (!filter.isActive === false) {
      filter.isActive = true;
    }

    const queryBuilder = this.queryService.prepareQueryBuilder(
      this.userRepository.createQueryBuilder(),
      filter,
      sort,
    );

    if (query) {
      queryBuilder.andWhere({
        $or: [
          { username: { $ilike: `%${query}%` } },
          { bio: { $ilike: `%${query}%` } },
        ],
      });
    }

    if (followed) {
      queryBuilder.andWhere({
        followershipsAsFollower: { follower: currentUser.id },
      });
    }

    return queryBuilder;
  }

  async encryptPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }
}
