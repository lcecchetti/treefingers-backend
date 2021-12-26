import { FilterQuery } from 'mongoose';
import { FilterInput } from './dto/filter.input';

const filterMap = {
  eq: '$eq',
  in: '$in',
  lt: '$lt',
  gt: '$gt',
  and: '$and',
  or: '$or',
};

export const gqlFilterToMongo = <T>(gqlFilter: FilterInput): FilterQuery<T> => {
  let mongoFilter = {};

  if (Array.isArray(gqlFilter)) {
    mongoFilter = gqlFilter.map((filter) => {
      return gqlFilterToMongo<T>(filter);
    });
  }

  Object.keys(gqlFilter).map((key) => {
    mongoFilter[filterMap[key] ?? key] =
      typeof gqlFilter[key] === 'object' && gqlFilter[key] !== null
        ? gqlFilterToMongo<T>(gqlFilter[key])
        : gqlFilter[key];
  });

  //mongoFilter['test'] = '';

  return mongoFilter;
};
