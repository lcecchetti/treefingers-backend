import { ObjectType } from '@nestjs/graphql';
import { Paginated } from 'src/query/dto/pagination.dto';
import { Tag } from '../tag.entity';

@ObjectType()
export class TagConnection extends Paginated(Tag) {}
