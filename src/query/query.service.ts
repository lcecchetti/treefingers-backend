import { Injectable } from '@nestjs/common';
import { Brackets, SelectQueryBuilder, WhereExpressionBuilder } from 'typeorm';
import { FilterInput } from './inputs/filter.input';
import { SortInput } from './inputs/sort.input';

const operatorsMap = {
  eq: '=',
  neq: '!=',
  lt: '<',
  lte: '<=',
  gt: '>',
  gte: '>=',
  in: 'IN',
  nin: 'NOT IN',
  like: 'LIKE',
  ilike: 'ILIKE',
};

const paramPre = 'filter_';

@Injectable()
export class QueryService<Entity> {
  addCondition(
    where: WhereExpressionBuilder,
    filter: FilterInput,
    field: string,
    paramId: number,
  ): WhereExpressionBuilder {
    Object.entries(filter).map(([operator, value]) => {
      switch (operator) {
        case 'eq':
        case 'neq':
        case 'lt':
        case 'lte':
        case 'gt':
        case 'gte':
        case 'like':
        case 'ilike':
          where.andWhere(
            `"${field}" ${operatorsMap[operator]} :${paramPre}${paramId}`,
            {
              [`${paramPre}${paramId}`]: value,
            },
          );
          break;
        case 'in':
        case 'nin':
          where.andWhere(
            `"${field}" ${operatorsMap[operator]} (:...${paramPre}${paramId})`,
            {
              [`${paramPre}${paramId}`]: value,
            },
          );
          break;
      }
    });

    return where;
  }

  addFilter(
    where: WhereExpressionBuilder,
    filter: FilterInput,
    field = '',
    paramId = 0,
  ) {
    if (!filter) {
      return where;
    }

    Object.entries(filter).map(([key, value]) => {
      switch (key) {
        case 'or':
        case 'and':
          where.andWhere(
            new Brackets((qb) =>
              value.forEach((subFilter) => {
                qb[`${key}Where`](
                  new Brackets((andOrQb) =>
                    this.addFilter(andOrQb, subFilter, key, paramId++),
                  ),
                );
              }),
            ),
          );
          break;
        default:
          if (operatorsMap[key]) {
            this.addCondition(where, filter, field, paramId++);
          } else {
            this.addFilter(where, value, key, paramId++);
          }
      }
    });
  }

  addSort(queryBuilder: SelectQueryBuilder<Entity>, sort: SortInput) {
    if (!sort) {
      return queryBuilder;
    }

    Object.entries(sort).map(([key, value]) => {
      queryBuilder.addOrderBy(key, value);
    });
  }

  prepareQueryBuilder(
    queryBuilder: SelectQueryBuilder<Entity>,
    filter: FilterInput,
    sort: SortInput = new SortInput(),
  ): SelectQueryBuilder<Entity> {
    queryBuilder.andWhere(new Brackets((qb) => this.addFilter(qb, filter)));
    this.addSort(queryBuilder, sort);
    return queryBuilder;
  }
}
