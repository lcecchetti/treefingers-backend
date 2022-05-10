import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { UserSchema } from './user.entity';
import { PaginationModule } from 'src/pagination/pagination.module';
import { FilterModule } from 'src/filter/filter.module';
import { UserDataloader } from './dataloaders/user.dataloader';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    PaginationModule,
    FilterModule,
  ],
  providers: [UserService, UserResolver, UserDataloader],
  exports: [UserService, UserDataloader],
})
export class UserModule {}
