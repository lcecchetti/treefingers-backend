import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from 'src/user/user.module';
import { FilterModule } from 'src/filter/filter.module';
import { FollowershipService } from './followership.service';
import { FollowershipResolver } from './followership.resolver';
import { FollowershipSchema } from './followership.entity';
import { UserSchema } from 'src/user/user.entity';
import { FollowershipDataloader } from './dataloaders/followership.dataloader';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Followership', schema: FollowershipSchema },
      { name: 'User', schema: UserSchema },
    ]),
    FilterModule,
    forwardRef(() => UserModule),
  ],
  providers: [
    FollowershipResolver,
    FollowershipService,
    FollowershipDataloader,
  ],
  exports: [FollowershipService, FollowershipDataloader],
})
export class FollowershipModule {}
