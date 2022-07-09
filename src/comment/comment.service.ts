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
import { NotificationService } from '../notification/notification.service';
import { ForestService } from '../forest/forest.service';
import { StoryService } from '../story/story.service';
import { NotificationWhat } from '../notification/enum/notification-what.enum';
import { NotificationReferenceType } from '../notification/enum/notification-reference-type.enum';
import { Notification } from '../notification/notification.entity';
import { NotificationSourceType } from '../notification/enum/notification-source-type.enum';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: EntityRepository<Comment>,
    private paginationService: PaginationService<Comment>,
    private queryService: QueryService<Comment>,
    private notificationService: NotificationService,
    private forestService: ForestService,
    private storyService: StoryService,
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

  async sendSubmitCommentNotification(comment: Comment): Promise<Notification> {
    if (comment.forest) {
      const forest = await this.forestService.findById(comment.forest.id);
      return this.notificationService.create({
        what: NotificationWhat.COMMENT_FOREST,
        who: comment.user.id,
        referenceId: forest.id,
        referenceType: NotificationReferenceType.FOREST,
        sourceId: comment.id,
        sourceType: NotificationSourceType.COMMENT,
        user: forest.founder.id,
      });
    }

    if (comment.story) {
      const story = await this.storyService.findById(comment.story.id);
      return this.notificationService.create({
        what: story.parent
          ? NotificationWhat.COMMENT_CHAPTER
          : NotificationWhat.COMMENT_STORY,
        who: comment.user.id,
        referenceId: story.id,
        referenceType: NotificationReferenceType.STORY,
        sourceId: comment.id,
        sourceType: NotificationSourceType.COMMENT,
        user: story.author.id,
      });
    }
  }

  async create(data: CommentDataInput): Promise<Comment> {
    const comment = await this.commentRepository.create(data);
    await this.commentRepository.persistAndFlush(comment);
    await this.sendSubmitCommentNotification(comment);
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
