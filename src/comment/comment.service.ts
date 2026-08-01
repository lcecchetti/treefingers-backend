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
import { Notification } from '../notification/notification.entity';
import { NotificationType } from '../notification/enum/notification-type.enum';
import { StringService } from '../common/services/string.service';
import { RequiredEntityData, wrap } from '@mikro-orm/core';
import { UrlService } from '../common/services/url.service';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: EntityRepository<Comment>,
    private paginationService: PaginationService<Comment>,
    private queryService: QueryService<Comment>,
    private notificationService: NotificationService,
    private stringService: StringService,
    private urlService: UrlService,
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

  async sendSubmitCommentNotification(
    comment: Comment,
  ): Promise<Notification | null> {
    await wrap(comment.user).init();
    const commentExcerpt = this.stringService.createExcerpt(
      comment.content,
      20,
    );

    if (comment.forest) {
      await wrap(comment.forest).init();
      const forestExcerpt = this.stringService.createExcerpt(
        comment.forest.name,
        20,
      );
      return this.notificationService.create({
        type: NotificationType.COMMENT_FOREST,
        actor: comment.user.id,
        targetId: comment.forest.id,
        sourceId: comment.id,
        user: comment.forest.founder.id,
        link: this.urlService.getForestUrl(comment.forest),
        content: `${comment.user.username} commented "${commentExcerpt}" on your forest "${forestExcerpt}"`,
      });
    }

    if (comment.story) {
      await wrap(comment.story).init();
      const storyExcerpt = this.stringService.createExcerpt(
        comment.story.title,
        20,
      );
      return this.notificationService.create({
        type: NotificationType.COMMENT_STORY,
        actor: comment.user.id,
        targetId: comment.story.id,
        sourceId: comment.id,
        user: comment.story.author.id,
        link: this.urlService.getStoryUrl(comment.story),
        content: `${comment.user.username} commented "${commentExcerpt}" on your story "${storyExcerpt}"`,
      });
    }

    return null;
  }

  async create(data: CommentDataInput): Promise<Comment> {
    const comment = await this.commentRepository.create(
      data as RequiredEntityData<Comment>,
    );
    await this.commentRepository.persistAndFlush(comment);
    await this.sendSubmitCommentNotification(comment);
    return comment;
  }

  async paginate(
    {
      filter,
      sort = new SortCommentInput(),
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
