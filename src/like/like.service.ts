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
import { NotificationWhat } from '../notification/enum/notification-what.enum';
import { StoryService } from '../story/story.service';
import { CommentService } from '../comment/comment.service';
import { NotificationReferenceType } from '../notification/enum/notification-reference-type.enum';
import { Notification } from '../notification/notification.entity';
import { NotificationSourceType } from '../notification/enum/notification-source-type.enum';

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(Like) private likeRepository: EntityRepository<Like>,
    private commentService: CommentService,
    private storyService: StoryService,
    private notificationService: NotificationService,
    private queryService: QueryService<Like>,
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
    if (like.comment) {
      const comment = await this.commentService.findById(like.comment.id);
      return this.notificationService.create(
        {
          what: NotificationWhat.LIKE_COMMENT,
          who: like.user.id,
          referenceId: comment.story?.id || comment.forest?.id,
          referenceType: comment.story?.id
            ? NotificationReferenceType.STORY
            : NotificationReferenceType.FOREST,
          sourceId: like.id,
          sourceType: NotificationSourceType.LIKE,
          user: comment.user.id,
        },
        true,
      );
    }

    if (like.story) {
      const story = await this.storyService.findById(like.story.id);
      return this.notificationService.create(
        {
          what: story.parent
            ? NotificationWhat.LIKE_CHAPTER
            : NotificationWhat.LIKE_STORY,
          who: like.user.id,
          referenceId: story.id,
          referenceType: NotificationReferenceType.STORY,
          sourceId: like.id,
          sourceType: NotificationSourceType.LIKE,
          user: story.author.id,
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
