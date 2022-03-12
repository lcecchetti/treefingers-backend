import { forwardRef, Module } from '@nestjs/common';
import { MembershipService } from './membership.service';
import { MembershipResolver } from './membership.resolver';
import { ForestModule } from 'src/forest/forest.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from 'src/user/user.module';
import { FilterModule } from 'src/filter/filter.module';
import { MembershipSchema } from './membership.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Membership', schema: MembershipSchema },
    ]),
    FilterModule,
    forwardRef(() => UserModule),
    forwardRef(() => ForestModule),
  ],
  providers: [MembershipResolver, MembershipService],
  exports: [MembershipService],
})
export class MembershipModule {}
