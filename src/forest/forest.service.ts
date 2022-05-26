import { ConflictException, Injectable } from '@nestjs/common';
import { Forest } from './forest.entity';
import { ForestConnectionArgs } from './args/forest-connection.args';
import { CreateForestDataInput } from './inputs/create-forest.input';
import { ForestConnection } from './dto/forest-connection.dto';
import { FilterForestInput } from './inputs/filter-forest.input';
import { PaginationService } from 'src/pagination/pagination.service';
import { QueryService } from 'src/query/query.service';
import { SortForestInput } from './inputs/sort-forest.input';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { Story } from 'src/story/story.entity';

@Injectable()
export class ForestService {
  constructor(
    private readonly em: EntityManager,
    @InjectRepository(Forest)
    private forestRepository: EntityRepository<Forest>,
    private paginationService: PaginationService<Forest>,
    private queryService: QueryService<Forest>,
  ) {}

  async findOne(filter?: FilterForestInput): Promise<Forest | null> {
    return this.prepareQueryBuilder(filter).getSingleResult();
  }

  async findMany(filter?: FilterForestInput): Promise<Forest[]> {
    return this.prepareQueryBuilder(filter).getResult();
  }

  async findById(id: number): Promise<Forest | null> {
    return this.findOne({ id: { eq: id } });
  }

  async create(data: CreateForestDataInput): Promise<Forest> {
    const existingName = await this.findOne({
      name: { eq: data.name },
    });
    if (existingName) {
      throw new ConflictException('Forest with same name already exists');
    }

    const forest = await this.forestRepository.create(data);
    await this.forestRepository.persistAndFlush(forest);
    return forest;
  }

  async paginate(
    {
      filter,
      sort,
      ...connectionArgs
    }: ForestConnectionArgs = new ForestConnectionArgs(),
  ): Promise<ForestConnection> {
    return this.paginationService.paginate(
      this.prepareQueryBuilder(filter, sort),
      sort,
      connectionArgs,
    );
  }

  prepareQueryBuilder(
    { query, ...filter }: FilterForestInput = new FilterForestInput(),
    sort: SortForestInput = new SortForestInput(),
  ) {
    const queryBuilder = this.queryService.prepareQueryBuilder(
      this.forestRepository.createQueryBuilder(),
      filter,
      sort,
    );

    if (query) {
      queryBuilder.andWhere({
        $or: [
          { name: { $ilike: `%${query}%` } },
          { about: { $ilike: `%${query}%` } },
        ],
      });
    }

    return queryBuilder;
  }
}
