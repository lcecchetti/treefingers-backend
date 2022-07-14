import { Injectable } from '@nestjs/common';
import { Like } from './like.entity';
import { FilterLikeInput } from './inputs/filter-like.input';
import { LikeInput } from './inputs/like.input';
import { DislikeInput } from './inputs/dislike.input';
import { QueryService } from '../query/query.service';
import { SortUserInput } from '../user/inputs/sort-user.input';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { NotificationService } from '../notification/notification.service';
import { Notification } from '../notification/notification.entity';
import { NotificationSourceType } from '../notification/enum/notification-source-type.enum';
import { NotificationType } from '../notification/enum/notification-type.enum';
import { wrap } from '@mikro-orm/core';
import { StringService } from '../common/services/string.service';

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(Like) private likeRepository: EntityRepository<Like>,
    private notificationService: NotificationService,
    private queryService: QueryService<Like>,
    private stringService: StringService,
  ) {}

  async findOne(filter?: FilterLikeInput): Promise<Like | null> {
    return this.prepareQueryBuilder(filter).getSingleResult();
  }

  async findMany(filter?: FilterLikeInput): Promise<Like[]> {
    return this.prepareQueryBuilder(filter).getResult();
  }

  async findById(id: number): Promise<Like | null> {
    return this.findOne({ id: { eq: id } });
  }

  async sendLikeNotification(like: Like): Promise<Notification> {
    await wrap(like.user).init();
    if (like.comment) {
      await wrap(like.comment).init();
      return this.notificationService.create(
        {
          type: NotificationType.LIKE,
          actor: like.user.id,
          sourceId: like.id,
          sourceType: NotificationSourceType.LIKE,
          user: like.comment.user.id,
          content: `${
            like.user.username
          } likes your comment "${this.stringService.createExcerpt(
            like.comment.content,
            20,
          )}"`,
        },
        true,
      );
    }

    if (like.story) {
      await wrap(like.story).init();
      return this.notificationService.create(
        {
          type: NotificationType.LIKE,
          actor: like.user.id,
          sourceId: like.id,
          sourceType: NotificationSourceType.LIKE,
          user: like.story.author.id,
          content: `${like.user.username} likes your ${
            like.story.parent ? 'chapter' : 'story'
          } "${this.stringService.createExcerpt(like.story.title, 20)}"`,
        },
        true,
      );
    }
  }

  async like(input: LikeInput): Promise<Like> {
    const like = await this.likeRepository.create(input);
    await this.likeRepository.persistAndFlush(like);
    await this.sendLikeNotification(like);
    return like;
  }

  async dislike({ comment, story, user }: DislikeInput): Promise<Like | null> {
    const like = await this.findOne({
      comment: comment ? { eq: comment } : null,
      story: story ? { eq: story } : null,
      user: { eq: user },
    });

    if (!like) {
      return null;
    }

    await this.likeRepository.removeAndFlush(like);
    return like;
  }

  prepareQueryBuilder(
    filter: FilterLikeInput = new FilterLikeInput(),
    sort: SortUserInput = new SortUserInput(),
  ) {
    return this.queryService.prepareQueryBuilder(
      this.likeRepository.createQueryBuilder(),
      filter,
      sort,
    );
  }
}
