import { ConflictException, Injectable } from '@nestjs/common';
import { Forest } from './forest.entity';
import { ForestConnectionArgs } from './args/forest-connection.args';
import { CreateForestDataInput } from './inputs/create-forest.input';
import { ForestConnection } from './dto/forest-connection.dto';
import { FilterForestInput } from './inputs/filter-forest.input';
import { PaginationService } from 'src/pagination/pagination.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { QueryService } from 'src/query/query.service';
import { SortForestInput } from './inputs/sort-forest.input';

@Injectable()
export class ForestService {
  constructor(
    @InjectRepository(Forest) private forestRepository: Repository<Forest>,
    private paginationService: PaginationService<Forest>,
    private queryService: QueryService<Forest>,
  ) {}

  async findOne(filter?: FilterForestInput): Promise<Forest | null> {
    return this.prepareQueryBuilder(filter).getOne();
  }

  async findMany(filter?: FilterForestInput): Promise<Forest[]> {
    return this.prepareQueryBuilder(filter).getMany();
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

    return this.forestRepository.save(data);
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
    const queryBuilder = this.forestRepository.createQueryBuilder();

    // add query conditon
    if (query) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where(`"name" ilike :query_name`, {
            ['query_name']: `%${query}%`,
          });
          qb.orWhere(`"about" ilike :query_about`, {
            ['query_about']: `%${query}%`,
          });
        }),
      );
    }

    return this.queryService.prepareQueryBuilder(queryBuilder, filter, sort);
  }
}
