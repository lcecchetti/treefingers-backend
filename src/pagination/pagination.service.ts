import { BadRequestException } from '@nestjs/common';
import { Model } from 'mongoose';
import { ConnectionArgs } from './args/connection.args';
import { IConnection } from './dto/pagination.dto';
import { SortInput, SORT_DIRECTION } from './inputs/sort.input';

const encodeCursor = (node: any, sort: SortInput): string => {
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
};

const decodeCursor = (cursor: string): any | null => {
  if (!cursor) {
    return null;
  }

  return JSON.parse(Buffer.from(String(cursor), 'base64').toString('ascii'));
};

const prepareCursorFilter = (
  sort: SortInput,
  { after, before }: ConnectionArgs,
): any => {
  if (!(after || before)) {
    return {};
  }

  // decode cursor
  const cursor = decodeCursor(after) || decodeCursor(before);

  // cursor conditions
  const conditions = [];

  // operator direction
  const ascOperator = after ? '$gt' : '$lt';
  const descOperator = after ? '$lt' : '$gt';

  // for each sort provided
  Object.keys(sort).forEach((key) => {
    // don't add _id condition if combined sort
    if (Object.keys(sort).length > 1 && key === '_id') {
      return;
    }

    // secondary column condition
    conditions.push({
      [key]: {
        [sort[key] === SORT_DIRECTION.ASC ? ascOperator : descOperator]:
          cursor[key],
      },
    });

    // primary column condition
    conditions.push({
      [key]: cursor[key],
      _id: {
        [sort._id === SORT_DIRECTION.ASC ? ascOperator : descOperator]:
          cursor._id,
      },
    });
  });

  return { $or: conditions };
};

export class PaginationService<E, D> {
  async paginate(
    model: Model<D>,
    filter: any = {},
    sort: SortInput = new SortInput(),
    { first, last, before, after }: ConnectionArgs = new ConnectionArgs(),
  ): Promise<IConnection<E>> {
    // only one couple of param should be provided per time
    if ((first && last) || (before && after)) {
      throw new BadRequestException('Provide only first/after or last/before');
    }

    // allow sort by maximum 2 fields, _id included
    if (
      Object.keys(sort).length > 2 ||
      (Object.keys(sort).length === 1 && !sort._id)
    ) {
      throw new BadRequestException('Sort by maximum 2 fields');
    }

    // prepare cursor filter
    const cursorFilter = prepareCursorFilter(sort, { after, before });

    // add cursor filter to filter
    const composedFilter = { $and: [filter, cursorFilter] };

    // get total query count
    const totalCount = await model.count(composedFilter);

    // prepare query options
    const limit = first || last || 10;
    const skip = last ? Math.max(totalCount - last, 0) : 0;

    // get nodes
    //@todo improve performances by removing skip and querying first item in reversed order
    const nodes = await model
      .find(composedFilter, null, { sort, limit, skip })
      .lean();

    const result: IConnection<E> = {};

    // build edges
    result.edges = nodes.map((node) => {
      return {
        cursor: encodeCursor(node, sort),
        node,
      };
    });

    // prepare page info
    result.pageInfo = {
      startCursor: result.edges.slice(0, 1).pop()?.cursor,
      endCursor: result.edges.slice(-1).pop()?.cursor,
      hasPreviousPage: last ? totalCount > limit : false,
      hasNextPage: first ? totalCount > limit : false,
      pagesCount: Math.ceil(totalCount / limit),
      totalCount,
    };

    return result;
  }
}
