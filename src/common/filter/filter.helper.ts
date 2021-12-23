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

export const gqlFilterToMongo = <T>(
  gqlFilter: FilterInput,
): FilterQuery<T> | any => {
  if (typeof gqlFilter !== 'object' || gqlFilter === null) {
    return gqlFilter;
  }

  const mongoFilter = {};
  Object.keys(gqlFilter).map((key) => {
    mongoFilter[filterMap[key] ?? key] = gqlFilterToMongo(gqlFilter[key]);
  });

  return mongoFilter;
};
