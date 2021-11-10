import { Model } from 'mongoose';
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

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async paginate(args: ConnectionInput): Promise<UserConnection> {
    return this.paginationService.paginate<User>(this.userModel, args);
  }
}
