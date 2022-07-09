import { Module } from '@nestjs/common';
import { FollowershipService } from './followership.service';
import { FollowershipResolver } from './followership.resolver';
import { Followership } from './followership.entity';
import { FollowershipDataloader } from './dataloaders/followership.dataloader';
import { QueryModule } from '../query/query.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [
    MikroOrmModule.forFeature([Followership]),
    QueryModule,
    NotificationModule,
  ],
  providers: [
    FollowershipResolver,
    FollowershipService,
    FollowershipDataloader,
  ],
  exports: [FollowershipService, FollowershipDataloader],
})
export class FollowershipModule {}
