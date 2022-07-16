import {
  Resolver,
  Query,
  Args,
  ResolveField,
  Parent,
  Mutation,
} from '@nestjs/graphql';
import { NotificationService } from './notification.service';
import { Notification } from './notification.entity';
import { User } from '../user/user.entity';
import { UserDataloader } from '../user/dataloaders/user.dataloader';
import { Loader } from '@tracworx/nestjs-dataloader';
import { NotificationConnection } from './dto/notification-connection.dto';
import { NotificationConnectionArgs } from './args/notification-connection.args';
import { GetCurrentUser } from '../auth/decorators/get-current-user.decorator';
import { CurrentUser } from '../auth/dto/current-user.dto';
import { UseGuards } from '@nestjs/common';
import { IsAuthenticatedGuard } from '../auth/guards/is-authenticated.guard';
import { ReadNotificationPayload } from './payloads/read-notification.payload';
import { ReadNotificationInput } from './inputs/read-notification.input';
import { ReadAllNotificationsPayload } from './payloads/read-all-notifications.payload';

@Resolver(() => Notification)
export class NotificationResolver {
  constructor(private notificationService: NotificationService) {}

  @UseGuards(IsAuthenticatedGuard)
  @Query(() => NotificationConnection)
  async notifications(
    @Args()
    args: NotificationConnectionArgs = new NotificationConnectionArgs(),
    @GetCurrentUser() currentUser: CurrentUser,
  ): Promise<NotificationConnection> {
    return this.notificationService.paginate(args, currentUser);
  }

  @ResolveField()
  async user(
    @Parent() notification: Notification,
    @Loader(UserDataloader) userDataloader,
  ): Promise<User> {
    return userDataloader.load(notification.user.id);
  }

  @ResolveField()
  async actor(
    @Parent() notification: Notification,
    @Loader(UserDataloader) userDataloader,
  ): Promise<User | null> {
    if (!notification.actor) {
      return null;
    }
    return userDataloader.load(notification.actor.id);
  }

  @UseGuards(IsAuthenticatedGuard)
  @Mutation(() => ReadNotificationPayload)
  async readNotification(
    @Args('input') { id }: ReadNotificationInput,
    @GetCurrentUser() currentUser: CurrentUser,
  ): Promise<ReadNotificationPayload> {
    return {
      notification: await this.notificationService.read(id, currentUser),
    };
  }

  @UseGuards(IsAuthenticatedGuard)
  @Mutation(() => ReadAllNotificationsPayload)
  async readAllNotifications(
    @GetCurrentUser() currentUser: CurrentUser,
  ): Promise<ReadAllNotificationsPayload> {
    return {
      count: await this.notificationService.readAll(currentUser.id),
    };
  }
}
