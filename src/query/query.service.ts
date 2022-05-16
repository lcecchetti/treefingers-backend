import { Injectable } from '@nestjs/common';
import {
  Equal,
  FindManyOptions,
  FindOptionsOrder,
  FindOptionsWhere,
} from 'typeorm';
import { FilterInput } from './inputs/filter.input';
import { SortInput } from './inputs/sort.input';

const operationsMap = {
  eq: Equal,
};

@Injectable()
export class QueryService<Entity> {
  prepareWhere(
    filter: FilterInput,
  ): FindOptionsWhere<Entity>[] | FindOptionsWhere<Entity> {
    //@todo build where from api
    return {};
  }

  prepareSort(sort: any): FindOptionsOrder<Entity> {
    return sort;
  }

  prepareOptions(
    filter: FilterInput,
    sort?: SortInput,
  ): FindManyOptions<Entity> {
    return {
      where: this.prepareWhere(filter),
      order: this.prepareSort(sort),
    };
  }
}
