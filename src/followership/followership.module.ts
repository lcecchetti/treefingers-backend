import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from 'src/user/user.module';
import { FilterModule } from 'src/filter/filter.module';
import { FollowershipService } from './followership.service';
import { FollowershipResolver } from './followership.resolver';
import { FollowershipSchema } from './followership.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Followership', schema: FollowershipSchema },
    ]),
    FilterModule,
    forwardRef(() => UserModule),
  ],
  providers: [FollowershipResolver, FollowershipService],
  exports: [FollowershipService],
})
export class FollowershipModule {}
