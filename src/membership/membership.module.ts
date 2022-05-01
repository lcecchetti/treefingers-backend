import { forwardRef, Module } from '@nestjs/common';
import { MembershipService } from './membership.service';
import { MembershipResolver } from './membership.resolver';
import { ForestModule } from 'src/forest/forest.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from 'src/user/user.module';
import { FilterModule } from 'src/filter/filter.module';
import { MembershipSchema } from './membership.entity';
import { ForestSchema } from 'src/forest/forest.entity';
import { MembershipDataloader } from './dataloaders/membership.dataloader';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Membership', schema: MembershipSchema },
      { name: 'Forest', schema: ForestSchema },
    ]),
    FilterModule,
    forwardRef(() => UserModule),
    forwardRef(() => ForestModule),
  ],
  providers: [MembershipResolver, MembershipService, MembershipDataloader],
  exports: [MembershipService, MembershipDataloader],
})
export class MembershipModule {}
