import { Injectable } from '@nestjs/common';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { FilterInput } from './inputs/filter.input';
import { SortInput } from './inputs/sort.input';

@Injectable()
export class QueryService<Entity> {
  private queryBuilder: SelectQueryBuilder<Entity>;

  addFilter(filter: FilterInput): void {
    return;
  }

  addSort(sort: SortInput): void {
    const orderBy = {};

    Object.keys(sort).forEach((key) => {
      orderBy[key] = sort[key];
    });

    this.queryBuilder.orderBy(orderBy);
  }

  prepareQueryBuilder(
    repository: Repository<Entity>,
    filter: FilterInput,
    sort: SortInput = new SortInput(),
  ): SelectQueryBuilder<Entity> {
    this.queryBuilder = repository.createQueryBuilder();

    this.addFilter(filter);
    this.addSort(sort);

    return this.queryBuilder;
  }
}
