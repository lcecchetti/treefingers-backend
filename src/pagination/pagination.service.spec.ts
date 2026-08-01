import { BadRequestException } from '@nestjs/common';
import { PaginationService } from './pagination.service';
import { SortDirection, SortInput } from '../query/inputs/sort.input';

function createQueryBuilderMock(overrides: Partial<any> = {}) {
  const qb: any = {
    andWhere: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    offset: jest.fn().mockReturnThis(),
    getCount: jest.fn().mockResolvedValue(0),
    getResult: jest.fn().mockResolvedValue([]),
    ...overrides,
  };
  qb.clone = jest.fn(() => qb);
  return qb;
}

describe('PaginationService', () => {
  let service: PaginationService<any>;

  beforeEach(() => {
    service = new PaginationService();
  });

  describe('encodeCursor', () => {
    it('returns an empty string when there is no node', () => {
      expect(service.encodeCursor(undefined, new SortInput())).toBe('');
    });

    it('encodes only the fields present in the sort input', () => {
      const node = { id: 5, name: 'ada', other: 'ignored' };
      const sort = { id: SortDirection.DESC, name: SortDirection.ASC };

      const cursor = service.encodeCursor(node, sort as any);
      const decoded = JSON.parse(Buffer.from(cursor, 'base64').toString());

      expect(decoded).toEqual({ id: 5, name: 'ada' });
    });

    it('skips sort fields absent from the node', () => {
      const node = { id: 5 };
      const sort = { id: SortDirection.DESC, name: SortDirection.ASC };

      const cursor = service.encodeCursor(node, sort as any);
      const decoded = JSON.parse(Buffer.from(cursor, 'base64').toString());

      expect(decoded).toEqual({ id: 5 });
    });
  });

  describe('decodeCursor', () => {
    it('returns null when there is no cursor', () => {
      expect(service.decodeCursor(undefined)).toBeNull();
    });

    it('decodes a base64-encoded cursor back to an object', () => {
      const cursor = Buffer.from(JSON.stringify({ id: 3 })).toString('base64');
      expect(service.decodeCursor(cursor)).toEqual({ id: 3 });
    });
  });

  describe('prepareCursorFilter', () => {
    it('returns an empty filter when there are no sort fields left', () => {
      expect(
        service.prepareCursorFilter({ id: 1 }, [], {
          ascComparison: '$gt',
          descComparison: '$lt',
        }),
      ).toEqual({});
    });

    it('builds a single comparison for the last remaining sort field', () => {
      const filter = service.prepareCursorFilter(
        { id: 5 },
        [['id', SortDirection.ASC]],
        { ascComparison: '$gt', descComparison: '$lt' },
      );

      expect(filter).toEqual({ $or: [{ id: { $gt: 5 } }] });
    });

    it('uses descComparison when the field sorts descending', () => {
      const filter = service.prepareCursorFilter(
        { id: 5 },
        [['id', SortDirection.DESC]],
        { ascComparison: '$gt', descComparison: '$lt' },
      );

      expect(filter).toEqual({ $or: [{ id: { $lt: 5 } }] });
    });

    it('recurses into an $and tiebreaker for additional sort fields', () => {
      const filter = service.prepareCursorFilter(
        { name: 'ada', id: 5 },
        [
          ['name', SortDirection.ASC],
          ['id', SortDirection.DESC],
        ],
        { ascComparison: '$gt', descComparison: '$lt' },
      );

      expect(filter).toEqual({
        $or: [
          { name: { $gt: 'ada' } },
          {
            $and: [{ name: { $eq: 'ada' } }, { $or: [{ id: { $lt: 5 } }] }],
          },
        ],
      });
    });
  });

  describe('addCursorFilter', () => {
    it('does nothing when neither after nor before is given', () => {
      const qb = createQueryBuilderMock();
      service.addCursorFilter(qb, new SortInput(), {});
      expect(qb.andWhere).not.toHaveBeenCalled();
    });

    it('adds a default (DESC) id sort when the sort has no id field', () => {
      const qb = createQueryBuilderMock();
      const cursor = Buffer.from(JSON.stringify({ id: 5 })).toString('base64');

      service.addCursorFilter(qb, {} as any, { after: cursor });

      // default sort is id DESC, so paginating `after` a cursor means
      // "older" entries, i.e. a smaller id
      expect(qb.andWhere).toHaveBeenCalledWith({
        $or: [{ id: { $lt: 5 } }],
      });
    });

    it('uses $gt/$lt for `after` and $lt/$gt for `before`', () => {
      const cursor = Buffer.from(JSON.stringify({ id: 5 })).toString('base64');

      const afterQb = createQueryBuilderMock();
      service.addCursorFilter(afterQb, new SortInput(), { after: cursor });
      expect(afterQb.andWhere).toHaveBeenCalledWith({
        $or: [{ id: { $lt: 5 } }],
      });

      const beforeQb = createQueryBuilderMock();
      service.addCursorFilter(beforeQb, new SortInput(), { before: cursor });
      expect(beforeQb.andWhere).toHaveBeenCalledWith({
        $or: [{ id: { $gt: 5 } }],
      });
    });
  });

  describe('paginate', () => {
    it('rejects when both first and last are provided', async () => {
      const qb = createQueryBuilderMock();
      await expect(
        service.paginate(qb, new SortInput(), { first: 1, last: 1 }),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('rejects when both before and after are provided', async () => {
      const qb = createQueryBuilderMock();
      await expect(
        service.paginate(qb, new SortInput(), {
          before: 'x',
          after: 'y',
        }),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('builds edges, cursors and page info for a first-page query', async () => {
      const nodes = [{ id: 1 }, { id: 2 }];
      const qb = createQueryBuilderMock({
        getCount: jest.fn().mockResolvedValue(5),
        getResult: jest.fn().mockResolvedValue(nodes),
      });

      const result = await service.paginate(qb, new SortInput(), {
        first: 2,
      });

      expect(qb.limit).toHaveBeenCalledWith(2);
      expect(qb.offset).toHaveBeenCalledWith(0);
      expect(result.edges).toHaveLength(2);
      expect(result.edges![0].node).toBe(nodes[0]);
      expect(result.pageInfo).toMatchObject({
        totalCount: 5,
        hasNextPage: true,
        hasPreviousPage: false,
        pagesCount: 3,
      });
      expect(result.pageInfo!.startCursor).toBe(
        service.encodeCursor(nodes[0], new SortInput()),
      );
      expect(result.pageInfo!.endCursor).toBe(
        service.encodeCursor(nodes[1], new SortInput()),
      );
    });

    it('computes an offset from remainingCount when paginating backwards with `last`', async () => {
      const qb = createQueryBuilderMock({
        getCount: jest.fn().mockResolvedValue(10),
        getResult: jest.fn().mockResolvedValue([]),
      });

      await service.paginate(qb, new SortInput(), { last: 3 });

      // remainingCount (10) - last (3) = 7
      expect(qb.offset).toHaveBeenCalledWith(7);
      expect(qb.limit).toHaveBeenCalledWith(3);
    });

    it('clamps the `last` offset to zero when remainingCount is smaller than last', async () => {
      const qb = createQueryBuilderMock({
        getCount: jest.fn().mockResolvedValue(2),
        getResult: jest.fn().mockResolvedValue([]),
      });

      await service.paginate(qb, new SortInput(), { last: 10 });

      expect(qb.offset).toHaveBeenCalledWith(0);
    });

    it('defaults the limit to 10 when neither first nor last is given', async () => {
      const qb = createQueryBuilderMock();

      await service.paginate(qb, new SortInput(), {});

      expect(qb.limit).toHaveBeenCalledWith(10);
    });

    it('reports hasPreviousPage instead of hasNextPage when paginating with `last`', async () => {
      const qb = createQueryBuilderMock({
        getCount: jest.fn().mockResolvedValue(10),
        getResult: jest.fn().mockResolvedValue([]),
      });

      const result = await service.paginate(qb, new SortInput(), {
        last: 3,
      });

      expect(result.pageInfo).toMatchObject({
        hasNextPage: false,
        hasPreviousPage: true,
      });
    });
  });
});
