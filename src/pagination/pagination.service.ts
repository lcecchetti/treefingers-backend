import { BadRequestException } from '@nestjs/common';
import { SortInput } from 'src/query/inputs/sort.input';
import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';
import { ConnectionArgs } from './args/connection.args';
import { IConnection } from './dto/pagination.dto';

export class PaginationService<Entity extends ObjectLiteral> {
  encodeCursor(node: any, sort: SortInput): string {
    if (!node) {
      return '';
    }

    const cursor = {};

    Object.keys(sort).forEach((key) => {
      if (node[key]) {
        cursor[key] = node[key];
      }
    });

    return Buffer.from(JSON.stringify(cursor)).toString('base64');
  }

  decodeCursor(cursor: string): any | null {
    if (!cursor) {
      return null;
    }

    return JSON.parse(Buffer.from(String(cursor), 'base64').toString('ascii'));
  }

  addCursorFilter(
    queryBuilder: SelectQueryBuilder<Entity>,
    sort: SortInput,
    { after, before }: ConnectionArgs,
  ): void {
    return;
  }

  async paginate(
    queryBuilder: SelectQueryBuilder<Entity>,
    sort: SortInput,
    { first, last, before, after }: ConnectionArgs,
  ): Promise<IConnection<Entity>> {
    // only one couple of param should be provided per time
    if ((first && last) || (before && after)) {
      throw new BadRequestException('Provide only first/after or last/before');
    }

    // get total query count
    const totalCount = await queryBuilder.getCount();

    // prepare cursor filter
    this.addCursorFilter(queryBuilder, sort, { after, before });

    const remainingCount = await queryBuilder.getCount();

    // prepare query options
    const limit = first || last || 10;
    const skip = last ? Math.max(remainingCount - last, 0) : 0;

    // get nodes
    //@todo improve performances by removing skip and querying first item in reversed order
    const nodes = await queryBuilder.limit(limit).skip(skip).getMany();

    const result: IConnection<Entity> = {};

    // build edges
    result.edges = nodes.map((node) => {
      return {
        cursor: this.encodeCursor(node, sort),
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
