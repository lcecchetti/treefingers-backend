import { Injectable } from '@nestjs/common';
import { FilterQuery } from 'mongoose';
import { FilterInput } from './inputs/filter.input';

const filterMap = {
  eq: '$eq',
  ne: '$ne',
  in: '$in',
  nin: '$nin',
  lt: '$lt',
  gt: '$gt',
  and: '$and',
  or: '$or',
};

@Injectable()
export class FilterService<D> {
  prepareFilter(gqlFilter: FilterInput): FilterQuery<D> {
    if (!gqlFilter) {
      return {};
    }

    // convert filters to string
    let filterString = JSON.stringify(gqlFilter);

    // replace gql to mongo
    Object.keys(filterMap).forEach((key) => {
      filterString = filterString.replace(
        new RegExp(`"${key}":`, 'g'),
        `"${filterMap[key]}":`,
      );
    });

    return JSON.parse(filterString);
  }
}
