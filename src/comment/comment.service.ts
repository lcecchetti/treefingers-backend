import { FilterQuery, Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CommentDocument, Comment } from './comment.entity';
import { CommentConnectionArgs } from './args/comment-connection.args';
import { CommentConnection } from './dto/comment-connection.dto';
import { FilterCommentInput } from './inputs/filter-comment.input';
import { PaginationService } from 'src/pagination/pagination.service';
import { FilterService } from 'src/filter/filter.service';
import { CommentDataInput } from './inputs/comment.input';
import { CommentableEntityType } from './enums/commentable-entity-type.enum';
import { StoryDocument } from 'src/story/story.entity';
import { ForestDocument } from 'src/forest/forest.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel('Comment') private commentModel: Model<CommentDocument>,
    @InjectModel('Forest') private forestModel: Model<ForestDocument>,
    @InjectModel('Story') private storyModel: Model<StoryDocument>,
    private paginationService: PaginationService<Comment, CommentDocument>,
    private filterService: FilterService<CommentDocument>,
  ) {}

  async findById(_id: string): Promise<Comment | null> {
    return this.commentModel.findById(_id).lean();
  }

  async findOne(
    filter: FilterCommentInput = new FilterCommentInput(),
  ): Promise<Comment | null> {
    return this.commentModel.findOne(this.prepareFilter(filter)).lean();
  }

  async findMany(filter?: FilterCommentInput): Promise<Comment[]> {
    return this.commentModel.find(this.prepareFilter(filter)).lean();
  }

  async create(data: CommentDataInput): Promise<Comment> {
    const comment = await this.commentModel.create(data);

    // pick entity model
    let model;
    switch (data.entityType) {
      case CommentableEntityType.Forest:
        model = this.forestModel;
        break;
      case CommentableEntityType.Story:
        model = this.storyModel;
        break;
    }

    // update entity model comments count
    await model.findByIdAndUpdate(data.entity, {
      $inc: { commentsCount: 1 },
    });

    return comment;
  }

  async paginate(
    {
      filter,
      sort,
      ...connectionArgs
    }: CommentConnectionArgs = new CommentConnectionArgs(),
  ): Promise<CommentConnection> {
    return this.paginationService.paginate(
      this.commentModel,
      this.prepareFilter(filter),
      sort,
      connectionArgs,
    );
  }

  async count(filter?: FilterCommentInput): Promise<number> {
    return this.commentModel.count(this.filterService.prepareFilter(filter));
  }

  prepareFilter(filter: FilterCommentInput): FilterQuery<Comment> {
    return this.filterService.prepareFilter(filter);
  }
}
