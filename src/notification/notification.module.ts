import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationResolver } from './notification.resolver';
import { PaginationModule } from '../pagination/pagination.module';
import { NotificationDataloader } from './dataloaders/notification.dataloader';
import { QueryModule } from '../query/query.module';
import { Notification } from './notification.entity';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { CommonModule } from '../common/common.module';
import { ForestModule } from '../forest/forest.module';

@Module({
  imports: [
    MikroOrmModule.forFeature([Notification]),
    PaginationModule,
    ForestModule,
    QueryModule,
    CommonModule,
  ],
  providers: [
    NotificationService,
    NotificationResolver,
    NotificationDataloader,
  ],
  exports: [NotificationService, NotificationDataloader],
})
export class NotificationModule {}
