import { Module } from '@nestjs/common';
import { FollowershipService } from './followership.service';
import { FollowershipResolver } from './followership.resolver';
import { Followership } from './followership.entity';
import { FollowershipDataloader } from './dataloaders/followership.dataloader';
import { QueryModule } from 'src/query/query.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';

@Module({
  imports: [MikroOrmModule.forFeature([Followership]), QueryModule],
  providers: [
    FollowershipResolver,
    FollowershipService,
    FollowershipDataloader,
  ],
  exports: [FollowershipService, FollowershipDataloader],
})
export class FollowershipModule {}
