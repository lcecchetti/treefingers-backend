import { Module } from '@nestjs/common';
import { MembershipService } from './membership.service';
import { MembershipResolver } from './membership.resolver';
import { ForestModule } from '../forest/forest.module';
import { Membership } from './membership.entity';
import { MembershipDataloader } from './dataloaders/membership.dataloader';
import { QueryModule } from '../query/query.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';

@Module({
  imports: [MikroOrmModule.forFeature([Membership]), QueryModule, ForestModule],
  providers: [MembershipResolver, MembershipService, MembershipDataloader],
  exports: [MembershipService, MembershipDataloader],
})
export class MembershipModule {}
