import { BadRequestException } from '@nestjs/common';
import { Console } from 'console';
import { FilterQuery, Model } from 'mongoose';
import { ConnectionArgs } from './args/connection.args';
import { IConnection } from './dto/pagination.dto';
import { FilterInput } from './inputs/filter.input';
import { SortInput, SORT_DIRECTION } from './inputs/sort.input';

const filterMap = {
  eq: '$eq',
  ne: '$ne',
  in: '$in',
  nin: '$nin',
  lt: '$lt',
  gt: '$gt',
  and: '$and',
  or: '$or',
  like: '$like',
};

const encodeCursor = (cursor: string): string => {
  if (!cursor) {
    return '';
  }

  return Buffer.from(String(cursor)).toString('base64');
};

const decodeCursor = (cursor: string): string => {
  if (!cursor) {
    return '';
  }

  return Buffer.from(String(cursor), 'base64').toString('ascii');
};

export class QueryService<E, D> {
  async paginate(
    model: Model<D>,
    filter: any = {},
    sort: any = new SortInput(),
    { first, last, before, after }: ConnectionArgs = new ConnectionArgs(),
  ): Promise<IConnection<E>> {
    // only one couple of param should be provided per time
    if ((first && last) || (before && after)) {
      throw new BadRequestException('Provide only first/after or last/before');
    }

    const result: IConnection<E> = {};

    // prepare cursor filter
    if (after) {
      const cursor = decodeCursor(after);
      filter._id =
        sort._id === SORT_DIRECTION.ASC ? { $gt: cursor } : { $lt: cursor };
    }
    if (before) {
      const cursor = decodeCursor(before);
      filter._id =
        sort._id === SORT_DIRECTION.ASC ? { $lt: cursor } : { $gt: cursor };
    }

    // get total query count
    const totalCount = await model.count(filter);

    // prepare query options
    const limit = first || last || 10;
    const skip = last ? Math.max(totalCount - last, 0) : 0;

    // get nodes
    //@todo improve performances by removing skip and querying first item in reversed order
    const nodes = await model.find(filter, null, { sort, limit, skip }).lean();

    // build edges
    result.edges = nodes.map((node) => {
      return {
        cursor: encodeCursor(node._id),
        node,
      };
    });

    // prepare page info
    result.pageInfo = {
      startCursor: result.edges.slice(0, 1).pop()?.cursor,
      endCursor: result.edges.slice(-1).pop()?.cursor,
      hasPreviousPage: last ? totalCount > limit : false,
      hasNextPage: first ? totalCount > limit : false,
    };

    return result;
  }

  gqlFilterToMongo(gqlFilter: FilterInput): FilterQuery<D> | undefined {
    if (!gqlFilter) {
      return undefined;
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

    // return parsed json object
    return JSON.parse(filterString);
  }
}
