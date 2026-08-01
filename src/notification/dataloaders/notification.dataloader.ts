import DataLoader from 'dataloader';
import { DataloaderProvider } from '@tracworx/nestjs-dataloader';
import { NotificationService } from '../notification.service';
import { Notification } from '../notification.entity';

@DataloaderProvider()
export class NotificationDataloader {
  constructor(private readonly notificationService: NotificationService) {}

  createDataloader() {
    return new DataLoader<number, Notification | undefined>(async (ids) => {
      const notifications = await this.notificationService.findMany({
        id: { in: [...ids] },
      });
      return ids.map((id) =>
        notifications.find((notification) => notification.id === id),
      );
    });
  }
}
