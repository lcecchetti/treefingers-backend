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

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private paginationService: PaginationService<User>,
    private queryService: QueryService<User>,
  ) {}

  async findById(id: number): Promise<User | null> {
    return this.userRepository.findOneBy({ id });
  }

  async findOne(filter?: FilterUserInput): Promise<User | null> {
    return this.userRepository.findOne(
      this.queryService.prepareOptions(filter),
    );
  }

  async findMany(filter?: FilterUserInput): Promise<User[]> {
    return this.userRepository.find(this.queryService.prepareOptions(filter));
  }

  async create(data: CreateUserInputData): Promise<User> {
    // check if user already exists
    const existingEmail = await this.userRepository.findOneBy({
      email: data.email,
    });
    if (existingEmail) {
      throw new ConflictException('Email already exists');
    }

    const existingUsername = await this.userRepository.findOneBy({
      username: data.username,
    });
    if (existingUsername) {
      throw new ConflictException('Username already exists');
    }

    const user = this.userRepository.create({
      ...data,
      password: await this.encryptPassword(data.password),
    });

    return this.userRepository.save(user);
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

  async paginate(
    {
      filter,
      sort,
      ...connectionArgs
    }: UserConnectionArgs = new UserConnectionArgs(),
  ): Promise<UserConnection> {
    return this.paginationService.paginate(
      this.userRepository,
      this.queryService.prepareOptions(filter, sort),
      connectionArgs,
    );
  }

  prepareFilter(filter: FilterUserInput): any {
    return this.queryService.prepareOptions(filter);
  }

  async encryptPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }
}
