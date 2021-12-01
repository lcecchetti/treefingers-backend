import { Injectable } from '@nestjs/common';
import { ConnectionInput } from './dto/connection.input';
import { DIRECTION } from './dto/sort.input';
import { IConnection } from './pagination.entity';

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
    connectionInput: ConnectionInput = new ConnectionInput(),
  ): Promise<IConnection<T>> {
    const result: IConnection<T> = {};

    // prepare arguments
    const { filter, sort, pagination } = connectionInput;
    const { cursor, pageSize, currentPage } = pagination;

    // validate inputs for cursor pagination
    if (cursor && (Object.keys(sort).length > 1 || !sort.id)) {
      throw new Error('Cursor pagination requires sorting only by _id');
    }

    // prepare cursor filter
    const currentCursor = decodeCursor(cursor);
    if (currentCursor) {
      filter.id =
        !sort.id || sort.id === DIRECTION.ASC
          ? { $gt: currentCursor }
          : { $lt: currentCursor };
    }

    const dbFilter: any = filter;
    if (filter.id) {
      dbFilter._id = filter.id;
      dbFilter.id = undefined;
    }

    // get nodes
    const nodes = await model
      .find(dbFilter, null, {
        sort: { _id: sort.id, ...sort },
        limit: pageSize,
        skip: pageSize * (currentPage - 1),
      })
      .exec();

    // build edges
    result.edges = nodes.map((node) => {
      return {
        cursor: encodeCursor(node.id),
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
}
