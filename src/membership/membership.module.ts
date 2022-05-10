import { Module } from '@nestjs/common';
import { MembershipService } from './membership.service';
import { MembershipResolver } from './membership.resolver';
import { ForestModule } from 'src/forest/forest.module';
import { MongooseModule } from '@nestjs/mongoose';
import { FilterModule } from 'src/filter/filter.module';
import { MembershipSchema } from './membership.entity';
import { MembershipDataloader } from './dataloaders/membership.dataloader';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Membership', schema: MembershipSchema },
    ]),
    FilterModule,
    ForestModule,
  ],
  providers: [MembershipResolver, MembershipService, MembershipDataloader],
  exports: [MembershipService, MembershipDataloader],
})
export class MembershipModule {}
