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

@Injectable()
export class QueryService<Entity> {
  addCondition(
    where: WhereExpressionBuilder,
    filter: FilterInput,
    field: string,
    paramId: string,
  ): WhereExpressionBuilder {
    Object.entries(filter).map(([operator, value]) => {
      paramId += `_${operator}`;
      switch (operator) {
        case 'eq':
          if (value === null) {
            where.andWhere(`"${field}" IS NULL`);
            break;
          }
        case 'neq':
          if (value === null) {
            where.andWhere(`"${field}" IS NOT NULL`);
            break;
          }
        case 'eq':
        case 'neq':
        case 'lt':
        case 'lte':
        case 'gt':
        case 'gte':
        case 'like':
        case 'ilike':
          where.andWhere(`"${field}" ${operatorsMap[operator]} :${paramId}`, {
            [`${paramId}`]: value,
          });
          break;
        case 'in':
        case 'nin':
          where.andWhere(
            `"${field}" ${operatorsMap[operator]} (:...${paramId})`,
            {
              [`${paramId}`]: value,
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
    paramId = 'filter',
  ) {
    if (!filter) {
      return where;
    }

    Object.entries(filter).map(([key, value]) => {
      paramId += `_${key}`;
      switch (key) {
        case 'or':
        case 'and':
          where.andWhere(
            new Brackets((qb) =>
              value.forEach((subFilter, index) => {
                paramId += `_${index}`;
                qb[`${key}Where`](
                  new Brackets((andOrQb) =>
                    this.addFilter(andOrQb, subFilter, key, paramId),
                  ),
                );
              }),
            ),
          );
          break;
        default:
          if (operatorsMap[key]) {
            this.addCondition(where, filter, field, paramId);
          } else {
            this.addFilter(where, value, key, paramId);
          }
      }
    });
  }

  addSort(queryBuilder: SelectQueryBuilder<Entity>, sort: SortInput) {
    if (!sort) {
      return queryBuilder;
    }

    Object.entries(sort).map(([key, value]) => {
      queryBuilder.addOrderBy(`"${key}"`, value);
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
