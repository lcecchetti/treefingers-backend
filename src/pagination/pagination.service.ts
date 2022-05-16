import { BadRequestException } from '@nestjs/common';
import { FindManyOptions, ObjectLiteral, Repository } from 'typeorm';
import { ConnectionArgs } from './args/connection.args';
import { IConnection } from './dto/pagination.dto';

export class PaginationService<Entity extends ObjectLiteral> {
  encodeCursor(node: any, queryOptions: FindManyOptions<Entity>): string {
    if (!node) {
      return '';
    }

    const cursor = {};

    if (queryOptions.order) {
      Object.keys(queryOptions.order).forEach((key) => {
        if (node[key]) {
          cursor[key] = node[key];
        }
      });
    }

    return Buffer.from(JSON.stringify(cursor)).toString('base64');
  }

  decodeCursor(cursor: string): any | null {
    if (!cursor) {
      return null;
    }

    return JSON.parse(Buffer.from(String(cursor), 'base64').toString('ascii'));
  }

  addCursorFilter(
    queryOptions: FindManyOptions<Entity> = {},
    { after, before }: ConnectionArgs,
  ): FindManyOptions<Entity> {
    return queryOptions;
  }

  async paginate(
    repository: Repository<Entity>,
    queryOptions: FindManyOptions<Entity> = {},
    { first, last, before, after }: ConnectionArgs = new ConnectionArgs(),
  ): Promise<IConnection<Entity>> {
    // only one couple of param should be provided per time
    if ((first && last) || (before && after)) {
      throw new BadRequestException('Provide only first/after or last/before');
    }

    // get total query count
    const totalCount = await repository.count(queryOptions);

    // prepare cursor filter
    this.addCursorFilter(queryOptions, { after, before });

    const remainingCount = await repository.count(queryOptions);

    // prepare query options
    const limit = first || last || 10;
    const skip = last ? Math.max(remainingCount - last, 0) : 0;

    // get nodes
    //@todo improve performances by removing skip and querying first item in reversed order
    const nodes = await repository.find({
      ...queryOptions,
      take: limit,
      skip,
    });

    const result: IConnection<Entity> = {};

    // build edges
    result.edges = nodes.map((node) => {
      return {
        cursor: this.encodeCursor(node, queryOptions),
        node,
      };
    });

    // prepare page info
    result.pageInfo = {
      startCursor: result.edges.slice(0, 1).pop()?.cursor,
      endCursor: result.edges.slice(-1).pop()?.cursor,
      hasPreviousPage: last ? remainingCount > limit : false,
      hasNextPage: first ? remainingCount > limit : false,
      pagesCount: Math.ceil(totalCount / limit),
      totalCount,
    };

    return result;
  }
}
