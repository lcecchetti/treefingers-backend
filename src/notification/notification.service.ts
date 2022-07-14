import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Notification } from './notification.entity';
import { NotificationConnectionArgs } from './args/notification-connection.args';
import { NotificationConnection } from './dto/notification-connection.dto';
import { FilterNotificationInput } from './inputs/filter-notification.input';
import { PaginationService } from '../pagination/pagination.service';
import { QueryService } from '../query/query.service';
import { SortNotificationInput } from './inputs/sort-notification.input';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { NotificationDataInput } from './inputs/notification.input';
import { CurrentUser } from '../auth/dto/current-user.dto';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: EntityRepository<Notification>,
    private paginationService: PaginationService<Notification>,
    private queryService: QueryService<Notification>,
  ) {}

  async findOne(
    filter?: FilterNotificationInput,
  ): Promise<Notification | null> {
    return this.prepareQueryBuilder(filter).getSingleResult();
  }

  async findMany(filter?: FilterNotificationInput): Promise<Notification[]> {
    return this.prepareQueryBuilder(filter).getResult();
  }

  async findById(id: number): Promise<Notification | null> {
    return this.findOne({ id: { eq: id } });
  }

  async create(
    data: NotificationDataInput,
    once?: boolean,
  ): Promise<Notification | null> {
    // avoid sending notification to self
    if (data.actor === data.user) {
      return null;
    }

    // avoid sending notification twice
    if (once) {
      const existingNotification = await this.findOne({
        actor: { eq: data.actor },
        type: { eq: data.type },
        targetId: { eq: data.targetId },
        targetType: { eq: data.targetType },
      });

      if (existingNotification) {
        return null;
      }
    }

    const notification = await this.notificationRepository.create(data);
    await this.notificationRepository.persistAndFlush(notification);
    return notification;
  }

  async read(id: number, currentUser: CurrentUser): Promise<Notification> {
    const notification = await this.findById(id);

    if (notification.user.id !== currentUser.id) {
      throw new UnauthorizedException(
        'You are not allowed to read this notification!',
      );
    }

    notification.read = true;
    await this.notificationRepository.persistAndFlush(notification);
    return notification;
  }

  async readAll(user: number): Promise<number> {
    const result = await this.notificationRepository
      .createQueryBuilder()
      .update({ read: true })
      .where({ user, read: false });
    return result.affectedRows;
  }

  async paginate(
    {
      filter,
      sort,
      ...connectionArgs
    }: NotificationConnectionArgs = new NotificationConnectionArgs(),
  ): Promise<NotificationConnection> {
    return this.paginationService.paginate(
      this.prepareQueryBuilder(filter, sort),
      sort,
      connectionArgs,
    );
  }

  prepareQueryBuilder(
    filter: FilterNotificationInput = new FilterNotificationInput(),
    sort: SortNotificationInput = new SortNotificationInput(),
  ) {
    return this.queryService.prepareQueryBuilder(
      this.notificationRepository.createQueryBuilder(),
      filter,
      sort,
    );
  }
}
