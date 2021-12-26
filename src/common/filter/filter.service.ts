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
  const mongoFilter = {};

  Object.keys(gqlFilter).map((key) => {
    const newKey = filterMap[key] ?? key;
    const value = gqlFilter[key];

    if (Array.isArray(value)) {
      mongoFilter[newKey] = value.map((filter) => {
        return gqlFilterToMongo<T>(filter);
      });
    } else if (typeof value === 'object' && value !== null) {
      mongoFilter[newKey] = gqlFilterToMongo<T>(value);
    } else {
      mongoFilter[newKey] = value;
    }
  });

  return mongoFilter;
};
