import { Module } from '@nestjs/common';
import { ForestService } from './forest.service';
import { ForestResolver } from './forest.resolver';
import { PaginationModule } from 'src/pagination/pagination.module';
import { ForestDataloader } from './dataloaders/forest.dataloader';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Forest } from './forest.entity';
import { QueryModule } from 'src/query/query.module';

@Module({
  imports: [TypeOrmModule.forFeature([Forest]), PaginationModule, QueryModule],
  providers: [ForestService, ForestResolver, ForestDataloader],
  exports: [ForestService, ForestDataloader],
})
export class ForestModule {}
