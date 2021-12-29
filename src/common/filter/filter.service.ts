import { FilterQuery } from 'mongoose';
import { FilterInput } from './dto/filter.input';
import { Types } from 'mongoose';

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
      // array condition
      mongoFilter[newKey] = value.map((filter) => {
        return gqlFilterToMongo<T>(filter);
      });
    } else if (value instanceof Types.ObjectId) {
      // mongoose id
      mongoFilter[newKey] = value.toString();
    } else if (typeof value === 'object' && value !== null) {
      // nested condition object
      mongoFilter[newKey] = gqlFilterToMongo<T>(value);
    } else {
      // condition value
      mongoFilter[newKey] = value;
    }
  });

  return mongoFilter;
};
