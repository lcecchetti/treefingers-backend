import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { User } from './user.entity';
import { PaginationModule } from 'src/pagination/pagination.module';
import { UserDataloader } from './dataloaders/user.dataloader';
import { QueryModule } from 'src/query/query.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';

@Module({
  imports: [MikroOrmModule.forFeature([User]), PaginationModule, QueryModule],
  providers: [UserService, UserResolver, UserDataloader],
  exports: [UserService, UserDataloader],
})
export class UserModule {}
