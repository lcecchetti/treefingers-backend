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
import { StoryService } from 'src/story/story.service';
import { ForestService } from 'src/forest/forest.service';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel('Comment') private commentModel: Model<CommentDocument>,
    private storyService: StoryService,
    private forestService: ForestService,
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

    // pick service
    let service;
    switch (data.entityType) {
      case CommentableEntityType.Forest:
        service = this.forestService;
        break;
      case CommentableEntityType.Story:
        service = this.storyService;
        break;
    }

    // update entity model comments count
    await service.updateCommentsCount(data.entity, 1);

    return comment;
  }

  async updateLikesCount(_id: string, modifier: number): Promise<Comment> {
    const filter = { _id };

    // safe check to avoid negative numbers
    if (modifier < 0) {
      filter['likesCount'] = { $gt: 0 };
    }

    return this.commentModel.findOneAndUpdate(filter, {
      $inc: { likesCount: modifier },
    });
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
