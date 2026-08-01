import { QueryService } from './query.service';
import { SortDirection } from './inputs/sort.input';

describe('QueryService', () => {
  let service: QueryService<any>;

  beforeEach(() => {
    service = new QueryService();
  });

  describe('prepareFilter', () => {
    it('returns an empty object when no filter is given', () => {
      expect(service.prepareFilter(undefined as any)).toEqual({});
    });

    it('translates gql operators to mikro-orm operators', () => {
      const filter = {
        name: { eq: 'ada', contains: 'ad' },
        age: { gt: 10, lte: 20 },
      };

      expect(service.prepareFilter(filter as any)).toEqual({
        name: { $eq: 'ada', $contains: 'ad' },
        age: { $gt: 10, $lte: 20 },
      });
    });

    it('translates nested and/or/not composites', () => {
      const filter = {
        and: [{ id: { eq: 1 } }, { id: { neq: 2 } }],
        or: [{ id: { in: [1, 2] } }],
        not: { id: { nin: [3] } },
      };

      expect(service.prepareFilter(filter as any)).toEqual({
        $and: [{ id: { $eq: 1 } }, { id: { $ne: 2 } }],
        $or: [{ id: { $in: [1, 2] } }],
        $not: { id: { $nin: [3] } },
      });
    });

    it('does not touch keys that are not gql operators', () => {
      const filter = { id: { eq: 1 }, unrelatedKey: 'value' };
      expect(service.prepareFilter(filter as any)).toEqual({
        id: { $eq: 1 },
        unrelatedKey: 'value',
      });
    });
  });

  describe('prepareSort', () => {
    it('returns an empty object when no sort is given', () => {
      expect(service.prepareSort(undefined as any)).toEqual({});
    });

    it('copies every key/value from the sort input', () => {
      const sort = { id: SortDirection.DESC, name: SortDirection.ASC };
      expect(service.prepareSort(sort as any)).toEqual({
        id: SortDirection.DESC,
        name: SortDirection.ASC,
      });
    });
  });

  describe('prepareQueryBuilder', () => {
    it('applies the prepared filter and sort to the query builder', () => {
      const queryBuilder = {
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
      };

      const filter = { id: { eq: 1 } };
      const sort = { id: SortDirection.ASC };

      const result = service.prepareQueryBuilder(
        queryBuilder as any,
        filter as any,
        sort as any,
      );

      expect(queryBuilder.andWhere).toHaveBeenCalledWith({ id: { $eq: 1 } });
      expect(queryBuilder.orderBy).toHaveBeenCalledWith({
        id: SortDirection.ASC,
      });
      expect(result).toBe(queryBuilder);
    });

    it('defaults sort to a new SortInput when not provided', () => {
      const queryBuilder = {
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
      };

      service.prepareQueryBuilder(queryBuilder as any, undefined as any);

      expect(queryBuilder.orderBy).toHaveBeenCalledWith({ id: 'DESC' });
    });
  });
});
