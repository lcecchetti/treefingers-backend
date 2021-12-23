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
  if (typeof gqlFilter !== 'object' || gqlFilter === null) {
    return;
  }

  const mongoFilter = {};
  Object.keys(gqlFilter).map((key) => {
    if (typeof gqlFilter[key] === 'object' && gqlFilter[key] !== null) {
      mongoFilter[filterMap[key] ?? key] = gqlFilterToMongo<T>(gqlFilter[key]);
    } else {
      mongoFilter[filterMap[key] ?? key] = gqlFilter[key];
    }
  });

  return mongoFilter;
};
