import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.entity';
import { QueryService } from 'src/query/query.service';
import { Model } from 'mongoose';
@Injectable()
export class UserService extends QueryService<User, UserDocument> {
  constructor(@InjectModel('User') protected model: Model<UserDocument>) {
    super(model);
  }
}
