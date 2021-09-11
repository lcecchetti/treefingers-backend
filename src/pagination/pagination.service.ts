import { Injectable } from '@nestjs/common';
import { IConnection } from './pagination.entity';
import { ConnectionInput, PaginationInput } from './pagination.dto';

class ParsedConnectionInput {
  filter?: any = {};
  sort?: any = { sort: { _id: 1 } };
  pagination?: PaginationInput;
}

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

@Injectable()
export class PaginationService {
  async paginate<T>(
    model: any,
    args: ConnectionInput = {},
  ): Promise<IConnection<T>> {
    const result: IConnection<T> = {};

    // prepare arguments
    const { filter = {}, sort = { _id: 1 }, pagination } = this.parseArgs(args);
    const { cursor, pageSize, currentPage } = pagination;

    // validate inputs for cursor pagination
    if (cursor && (sort.length > 1 || !sort._id)) {
      throw new Error('Cursor pagination requires sorting only by _id');
    }

    // prepare cursor filter
    const currentCursor = decodeCursor(cursor);
    if (currentCursor) {
      filter._id =
        sort._id > 0 ? { $gt: currentCursor } : { $lt: currentCursor };
    }

    // get nodes
    const nodes = await model.find(filter, null, { sort, limit: pageSize, skip: pageSize * (currentPage - 1) });

    // build edges
    result.edges = nodes.map((node) => {
      return {
        cursor: encodeCursor(node._id),
        node,
      };
    });

    // prepare page infos
    const totalCount = await model.estimatedDocumentCount(filter);
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

  parseArgs(args: ConnectionInput = {}): ParsedConnectionInput {
    args.filter = args.filter && JSON.parse(args.filter);
    args.sort = args.sort && JSON.parse(args.sort);

    return args;
  }
}
