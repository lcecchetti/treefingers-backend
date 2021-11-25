import { Injectable } from '@nestjs/common';
import { ConnectionInput } from './dto/connection.input';
import { IConnection } from './pagination.entity';

class ParsedConnectionInput extends ConnectionInput {
  filter?: any = {};
  sort?: any = {};
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

// @todo: implement filter/sort specific to the collection, without generic mongodb rules
const parseConnectionInput = (
  connectionInput: ConnectionInput,
): ParsedConnectionInput => {
  const parsedConnectionInput: ParsedConnectionInput = connectionInput;

  parsedConnectionInput.filter = connectionInput.filter
    ? JSON.parse(connectionInput.filter)
    : {};
  parsedConnectionInput.sort = connectionInput.sort
    ? JSON.parse(connectionInput.sort)
    : {};

  return parsedConnectionInput;
};

@Injectable()
export class PaginationService {
  async paginate<T>(
    model: any,
    connectionInput: ConnectionInput = new ConnectionInput(),
  ): Promise<IConnection<T>> {
    const result: IConnection<T> = {};

    // prepare arguments
    const { filter, sort, pagination } = parseConnectionInput(connectionInput);
    const { cursor, pageSize, currentPage } = pagination;

    // set default sort direction
    sort._id = sort._id ?? 1;

    // validate inputs for cursor pagination
    if (cursor && (Object.keys(sort).length > 1 || !sort._id)) {
      throw new Error('Cursor pagination requires sorting only by _id');
    }

    // prepare cursor filter
    const currentCursor = decodeCursor(cursor);
    if (currentCursor) {
      filter._id =
        sort._id > 0 ? { $gt: currentCursor } : { $lt: currentCursor };
    }

    // get nodes
    const nodes = await model
      .find(filter, null, {
        sort,
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
