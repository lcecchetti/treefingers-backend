import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ForestService } from './forest.service';
import { ForestResolver } from './forest.resolver';
import { ForestSchema } from './forest.entity';
import { PaginationModule } from 'src/pagination/pagination.module';
import { FilterModule } from 'src/filter/filter.module';
import { ForestDataloader } from './dataloaders/forest.dataloader';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Forest', schema: ForestSchema }]),
    PaginationModule,
    FilterModule,
  ],
  providers: [ForestService, ForestResolver, ForestDataloader],
  exports: [ForestService, ForestDataloader],
})
export class ForestModule {}
