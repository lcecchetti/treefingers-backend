import { QBFilterQuery, QBQueryOrderMap } from '@mikro-orm/core';
import { QueryBuilder } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { FilterInput } from './inputs/filter.input';
import { SortInput } from './inputs/sort.input';

const operatorsMap = {
  eq: '$eq',
  ne: '$ne',
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
};

@Injectable()
export class QueryService<Entity> {
  prepareFilter(filter: FilterInput): QBFilterQuery<Entity> {
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

  prepareSort(sort: SortInput): QBQueryOrderMap<Entity> {
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
    queryBuilder.andWhere(this.prepareFilter(filter));
    queryBuilder.orderBy(this.prepareSort(sort));
    return queryBuilder;
  }
}
