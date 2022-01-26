import { ObjectType } from '@nestjs/graphql';
import { Paginated } from 'src/query/dto/pagination.dto';
import { Forest } from '../forest.entity';

@ObjectType()
export class ForestConnection extends Paginated(Forest) {}
