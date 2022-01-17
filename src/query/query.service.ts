import { FilterQuery, Model } from 'mongoose';
import { ConnectionArgs } from './args/connection.args';
import { IConnection } from './dto/pagination.dto';
import { FilterInput } from './inputs/filter.input';
import { PaginationInput } from './inputs/pagination.input';
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
    pagination: PaginationInput = new PaginationInput(),
  ): Promise<IConnection<E>> {
    const result: IConnection<E> = {};

    // prepare arguments
    const { cursor, pageSize, currentPage } = pagination;

    // validate inputs for cursor pagination
    if (cursor && (Object.keys(sort).length > 1 || !sort._id)) {
      throw new Error('Cursor pagination requires sorting only by _id');
    }

    // prepare cursor filter
    const currentCursor = decodeCursor(cursor);
    if (currentCursor) {
      filter._id =
        !sort._id || sort._id === SORT_DIRECTION.ASC
          ? { $gt: currentCursor }
          : { $lt: currentCursor };
    }

    // get nodes
    const nodes = await model
      .find(filter, null, {
        sort,
        limit: pageSize,
        skip: pageSize * (currentPage - 1),
      })
      .lean();

    // build edges
    result.edges = nodes.map((node) => {
      return {
        cursor: encodeCursor(node._id),
        node,
      };
    });

    // prepare page infos
    const totalCount = await model.count(filter);
    const pagesCount = pageSize ? Math.ceil(totalCount / pageSize) : 1;

    result.pageInfo = {
      totalCount,
      pagesCount,
      pageSize,
      currentPage,
      startCursor: result.edges.slice(0, 1).pop()?.cursor,
      endCursor: result.edges.slice(-1).pop()?.cursor,
      hasNextPage: currentPage < pagesCount,
    };

    return result;
  }

  gqlFilterToMongo(gqlFilter: FilterInput): FilterQuery<D> | null {
    if (!gqlFilter) {
      return null;
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
