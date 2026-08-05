import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Forest } from './forest.entity';
import { ForestConnectionArgs } from './args/forest-connection.args';
import { CreateForestDataInput } from './inputs/create-forest.input';
import { ForestConnection } from './dto/forest-connection.dto';
import { FilterForestInput } from './inputs/filter-forest.input';
import { PaginationService } from '../pagination/pagination.service';
import { QueryService } from '../query/query.service';
import { SortForestInput } from './inputs/sort-forest.input';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { CurrentUser } from '../auth/dto/current-user.dto';
import { EditForestDataInput } from './inputs/edit-forest.input';
import { RequiredEntityData, wrap } from '@mikro-orm/core';

@Injectable()
export class ForestService {
  constructor(
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

    const forest = await this.forestRepository.create(
      data as RequiredEntityData<Forest>,
    );
    await this.forestRepository.getEntityManager().persist(forest).flush();
    return forest;
  }

  isEditable(forest: Forest, currentUser: CurrentUser): boolean {
    return currentUser && currentUser.id === forest.founder.id;
  }

  async edit(
    id: number,
    data: EditForestDataInput,
    currentUser: CurrentUser,
  ): Promise<Forest> {
    const forest = await this.findById(id);

    if (!forest) {
      throw new NotFoundException(
        'The forest you are trying to edit does not exist.',
      );
    }

    if (!this.isEditable(forest, currentUser)) {
      throw new ForbiddenException(
        'You are not the founder of this forest.',
      );
    }

    wrap(forest).assign(data);
    await this.forestRepository.getEntityManager().persist(forest).flush();
    return forest;
  }

  async paginate(
    {
      filter,
      sort = new SortForestInput(),
      ...connectionArgs
    }: ForestConnectionArgs = new ForestConnectionArgs(),
    currentUser?: CurrentUser,
  ): Promise<ForestConnection> {
    return this.paginationService.paginate(
      this.prepareQueryBuilder(filter, sort, currentUser),
      sort,
      connectionArgs,
    );
  }

  prepareQueryBuilder(
    { query, joined, ...filter }: FilterForestInput = new FilterForestInput(),
    sort: SortForestInput = new SortForestInput(),
    currentUser?: CurrentUser,
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

    if (joined) {
      if (!currentUser) {
        throw new UnauthorizedException(
          'You must be logged in to filter by joined forests.',
        );
      }
      // no DISTINCT: it conflicts with the default sort's ORDER BY once the
      // memberships join is added (Postgres rejects SELECT DISTINCT *
      // combined with an ORDER BY on a joined column)
      queryBuilder.select('*').andWhere({
        memberships: { member: currentUser.id },
      });
    }

    return queryBuilder;
  }
}
