import { Module } from '@nestjs/common';
import { ForestService } from './forest.service';
import { ForestResolver } from './forest.resolver';
import { PaginationModule } from '../pagination/pagination.module';
import { ForestDataloader } from './dataloaders/forest.dataloader';
import { Forest } from './forest.entity';
import { QueryModule } from '../query/query.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';

@Module({
  imports: [MikroOrmModule.forFeature([Forest]), PaginationModule, QueryModule],
  providers: [ForestService, ForestResolver, ForestDataloader],
  exports: [ForestService, ForestDataloader],
})
export class ForestModule {}
