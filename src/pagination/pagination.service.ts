import { BadRequestException } from '@nestjs/common';
import { SortInput, SORT_DIRECTION } from 'src/query/inputs/sort.input';
import {
  Brackets,
  ObjectLiteral,
  SelectQueryBuilder,
  WhereExpressionBuilder,
} from 'typeorm';
import { ConnectionArgs } from './args/connection.args';
import { IConnection } from './dto/pagination.dto';

const paramPre = 'cursor_';
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

  prepareCursorFilter(
    where: WhereExpressionBuilder,
    cursor,
    sortArray: [string, SORT_DIRECTION][],
    { ascComparison, descComparison },
    paramId = 0,
  ) {
    // current sort field
    const [field, direction] = sortArray.shift();

    // comparison operator
    const comparison =
      direction === SORT_DIRECTION.ASC ? ascComparison : descComparison;

    // add non unique constraint
    paramId++;
    where.where(`"${field}" ${comparison} :${paramPre}${paramId}`, {
      [`${paramPre}${paramId}`]: cursor[field],
    });

    if (!sortArray.length) {
      return;
    }

    // add subi
    where.orWhere(
      new Brackets((orQb) => {
        paramId++;
        orQb.where(`"${field}" = :${paramPre}${paramId}`, {
          [`${paramPre}${paramId}`]: cursor[field],
        });

        orQb.andWhere(
          new Brackets((andQb) => {
            this.prepareCursorFilter(
              andQb,
              cursor,
              sortArray,
              { ascComparison, descComparison },
              paramId,
            );
          }),
        );
      }),
    );
  }

  addCursorFilter(
    queryBuilder: SelectQueryBuilder<Entity>,
    sort: SortInput = new SortInput(),
    { after, before }: ConnectionArgs,
  ) {
    if (!(after || before)) {
      return;
    }

    // add default sorting
    if (!sort.id) {
      sort = {
        ...sort,
        ...new SortInput(),
      };
    }

    // decode cursor
    const cursor = this.decodeCursor(after) || this.decodeCursor(before);

    // sort fields as ordered array (order defined by class keys)
    const sortFields = Object.entries(sort);

    // add cursor filter
    queryBuilder.andWhere(
      new Brackets((where) => {
        this.prepareCursorFilter(where, cursor, sortFields, {
          ascComparison: after ? '>' : '<',
          descComparison: after ? '<' : '>',
        });
      }),
    );
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
    const nodes = await queryBuilder.take(limit).skip(skip).getMany();

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
