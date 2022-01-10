import { FilterQuery, Model } from 'mongoose';
import { ConnectionArgs } from './args/connection.args';
import { FilterInput } from './dto/filter.input';
import { IConnection } from './dto/pagination.dto';
import { SORT_DIRECTION } from './dto/sort.input';

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
  model: Model<D>;

  constructor(model) {
    this.model = model;
  }

  async paginate(
    { filter, sort, pagination }: ConnectionArgs = new ConnectionArgs(),
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
          ? { gt: currentCursor }
          : { lt: currentCursor };
    }

    // convert filter
    const mongoFilter = this.gqlFilterToMongo(filter);

    // get nodes
    const nodes = await this.model
      .find(mongoFilter, null, {
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
    const totalCount = await this.model.count(mongoFilter);
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

  gqlFilterToMongo(gqlFilter: FilterInput): FilterQuery<D> {
    // convert filters to string
    let filterString = JSON.stringify(gqlFilter);

    // replace gql to mongo
    Object.keys(filterMap).forEach((key) => {
      filterString = filterString.replace(`"${key}":`, `"${filterMap[key]}":`);
    });

    // return parsed json object
    return JSON.parse(filterString);
  }
}
