import { AnyEntity, FilterQuery, QueryOrderMap } from '@mikro-orm/core';
import { QueryBuilder } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { FilterInput } from './inputs/filter.input';
import { SortInput } from './inputs/sort.input';

const operatorsMap = {
  eq: '$eq',
  neq: '$ne',
  lt: '$lt',
  lte: '$lte',
  gt: '$gt',
  gte: '$gte',
  in: '$in',
  nin: '$nin',
  like: '$like',
  ilike: '$ilike',
  and: '$and',
  or: '$or',
  not: '$not',
  contains: '$contains',
};

@Injectable()
export class QueryService<Entity extends AnyEntity<Entity>> {
  prepareFilter(filter: FilterInput): FilterQuery<Entity> {
    if (!filter) {
      return {};
    }

    // convert filters to string
    let filterString = JSON.stringify(filter);

    // replace gql to db
    Object.entries(operatorsMap).forEach(([gqlOperator, dbOperator]) => {
      filterString = filterString.replace(
        new RegExp(`"${gqlOperator}":`, 'g'),
        `"${dbOperator}":`,
      );
    });

    return JSON.parse(filterString);
  }

  prepareSort(sort: SortInput): QueryOrderMap<Entity> {
    const orderBy = {};

    if (!sort) {
      return orderBy;
    }

    Object.entries(sort).map(([key, value]) => {
      orderBy[key] = value;
    });

    return orderBy;
  }

  prepareQueryBuilder(
    queryBuilder: QueryBuilder<Entity>,
    filter: FilterInput,
    sort: SortInput = new SortInput(),
  ): QueryBuilder<Entity> {
    // QueryBuilder<Entity> tracks join-alias generics that this generic,
    // entity-agnostic service has no way to know; the filter/sort objects
    // built above only ever reference direct columns, never aliases.
    queryBuilder.andWhere(this.prepareFilter(filter) as never);
    queryBuilder.orderBy(this.prepareSort(sort) as never);
    return queryBuilder;
  }
}
