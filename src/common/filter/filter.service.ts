import { FilterQuery } from 'mongoose';
import { FilterInput } from './dto/filter.input';

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

export const gqlFilterToMongo = <T>(gqlFilter: FilterInput): FilterQuery<T> => {
  // convert filters to string
  let filterString = JSON.stringify(gqlFilter);

  // replace gql to mongo
  Object.keys(filterMap).forEach((key) => {
    filterString = filterString.replace(key, filterMap[key]);
  });

  console.log(JSON.parse(filterString));
  // return parsed json object
  return JSON.parse(filterString);
};
