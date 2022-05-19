import { Injectable } from '@nestjs/common';
import { Comment } from './comment.entity';
import { CommentConnectionArgs } from './args/comment-connection.args';
import { CommentConnection } from './dto/comment-connection.dto';
import { FilterCommentInput } from './inputs/filter-comment.input';
import { PaginationService } from 'src/pagination/pagination.service';
import { CommentDataInput } from './inputs/comment.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QueryService } from 'src/query/query.service';
import { SortCommentInput } from './inputs/sort-comment.input';
import { ForestComment } from './forest-comment.entity';
import { CommentableEntityType } from './enums/commentable-entity-type.enum';
import { StoryComment } from './story-comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment) private commentRepository: Repository<Comment>,
    @InjectRepository(ForestComment)
    private forestCommentRepository: Repository<ForestComment>,
    @InjectRepository(StoryComment)
    private storyCommentRepository: Repository<StoryComment>,
    private paginationService: PaginationService<Comment>,
    private queryService: QueryService<Comment>,
  ) {}

  async findOne(filter?: FilterCommentInput): Promise<Comment | null> {
    return this.prepareQueryBuilder(filter).getOne();
  }

  async findMany(filter?: FilterCommentInput): Promise<Comment[]> {
    return this.prepareQueryBuilder(filter).getMany();
  }

  async findById(id: number): Promise<Comment | null> {
    return this.findOne({ id: { eq: id } });
  }

  async create(data: CommentDataInput): Promise<Comment> {
    switch (data.entityType) {
      case CommentableEntityType.ForestComment:
        return this.forestCommentRepository.save(data);
      case CommentableEntityType.StoryComment:
        return this.storyCommentRepository.save(data);
    }
  }

  async paginate(
    {
      filter,
      sort,
      ...connectionArgs
    }: CommentConnectionArgs = new CommentConnectionArgs(),
  ): Promise<CommentConnection> {
    return this.paginationService.paginate(
      this.prepareQueryBuilder(filter, sort),
      sort,
      connectionArgs,
    );
  }

  prepareQueryBuilder(
    filter: FilterCommentInput = new FilterCommentInput(),
    sort: SortCommentInput = new SortCommentInput(),
  ) {
    return this.queryService.prepareQueryBuilder(
      this.commentRepository.createQueryBuilder(),
      filter,
      sort,
    );
  }
}
