import { Injectable } from '@nestjs/common';
import { IConnection } from './pagination.entity';
import { ConnectionInput, PaginationInput } from './pagination.dto';

class ParsedConnectionInput extends ConnectionInput {
  filter?: any = {};
  sort?: any = {};
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

// @todo: implement filter/sort specific to the collection, without generic mongodb rules
const parseArgs = (args: ConnectionInput): ParsedConnectionInput => {
  const parsedArgs = new ParsedConnectionInput();
  if (args.filter) {
    parsedArgs.filter = JSON.parse(args.filter);
  }
  if (args.sort) {
    parsedArgs.sort = JSON.parse(args.sort);
  }

  return parsedArgs;
};

@Injectable()
export class PaginationService {
  async paginate<T>(
    model: any,
    args: ConnectionInput,
  ): Promise<IConnection<T>> {
    const result: IConnection<T> = {};

    // prepare arguments
    const { filter, sort, pagination } = parseArgs(args);
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
