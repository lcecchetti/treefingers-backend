import { Injectable } from '@nestjs/common';
import { Comment } from './comment.entity';
import { CommentConnectionArgs } from './args/comment-connection.args';
import { CommentConnection } from './dto/comment-connection.dto';
import { FilterCommentInput } from './inputs/filter-comment.input';
import { PaginationService } from '../pagination/pagination.service';
import { CommentDataInput } from './inputs/comment.input';
import { QueryService } from '../query/query.service';
import { SortCommentInput } from './inputs/sort-comment.input';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: EntityRepository<Comment>,
    private paginationService: PaginationService<Comment>,
    private queryService: QueryService<Comment>,
  ) {}

  async findOne(filter?: FilterCommentInput): Promise<Comment | null> {
    return this.prepareQueryBuilder(filter).getSingleResult();
  }

  async findMany(filter?: FilterCommentInput): Promise<Comment[]> {
    return this.prepareQueryBuilder(filter).getResult();
  }

  async findById(id: number): Promise<Comment | null> {
    return this.findOne({ id: { eq: id } });
  }

  async create(data: CommentDataInput): Promise<Comment> {
    const comment = await this.commentRepository.create(data);
    await this.commentRepository.persistAndFlush(comment);
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
