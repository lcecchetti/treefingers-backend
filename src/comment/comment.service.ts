import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, CommentDocument } from './comment.entity';
import { QueryService } from 'src/query/query.service';

@Injectable()
export class CommentService extends QueryService<Comment, CommentDocument> {
  constructor(@InjectModel('Comment') model: Model<CommentDocument>) {
    super(model);
  }
}
