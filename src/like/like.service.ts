import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Like, LikeDocument } from './like.entity';
import { QueryService } from 'src/query/query.service';

@Injectable()
export class LikeService extends QueryService<Like, LikeDocument> {
  constructor(@InjectModel('Like') protected model: Model<LikeDocument>) {
    super(model);
  }
}
