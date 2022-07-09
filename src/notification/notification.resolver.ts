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
import { CommentDataloader } from '../comment/dataloaders/comment.dataloader';
import { StoryDataloader } from '../story/dataloaders/story.dataloader';
import { ForestDataloader } from '../forest/dataloaders/forest.dataloader';
import { NotificationReferenceType } from './enum/notification-reference-type.enum';
import { NotificationDetails } from './dto/notification-details';
import { StringService } from '../common/services/string.service';
import { NotificationSourceType } from './enum/notification-source-type.enum';

@Resolver(() => Notification)
export class NotificationResolver {
  constructor(
    private notificationService: NotificationService,
    private stringService: StringService,
  ) {}

  @UseGuards(IsAuthenticatedGuard)
  @Query(() => NotificationConnection)
  async notifications(
    @Args()
    args: NotificationConnectionArgs = new NotificationConnectionArgs(),
    @GetCurrentUser() currentUser: CurrentUser,
  ): Promise<NotificationConnection> {
    args.filter.user = { eq: currentUser.id };

    return this.notificationService.paginate(args);
  }

  @ResolveField()
  async user(
    @Parent() notification: Notification,
    @Loader(UserDataloader) userDataloader,
  ): Promise<User> {
    return userDataloader.load(notification.user.id);
  }

  @ResolveField()
  async who(
    @Parent() notification: Notification,
    @Loader(UserDataloader) userDataloader,
  ): Promise<User> {
    return userDataloader.load(notification.user.id);
  }

  @ResolveField(() => NotificationDetails, { nullable: true })
  async details(
    @Parent() notification: Notification,
    @Loader(StoryDataloader) storyDataLoader,
    @Loader(ForestDataloader) forestDataLoader,
    @Loader(CommentDataloader) commentDataLoader,
  ): Promise<NotificationDetails | null> {
    console.log('details');
    const details: NotificationDetails = {};
    switch (notification.referenceType) {
      case NotificationReferenceType.FOREST:
        const forest = await forestDataLoader.load(notification.referenceId);
        details.referenceLabel = this.stringService.createExcerpt(
          forest.name,
          50,
        );
      case NotificationReferenceType.STORY:
        const story = await storyDataLoader.load(notification.referenceId);
        details.referenceLabel = this.stringService.createExcerpt(
          story.title,
          50,
        );
    }

    switch (notification.sourceType) {
      case NotificationSourceType.COMMENT:
        const comment = await commentDataLoader.load(notification.sourceId);
        details.sourceLabel = this.stringService.createExcerpt(
          comment.content,
          50,
        );
    }

    return details;
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
