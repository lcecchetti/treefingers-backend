import { Paginated } from 'src/pagination/pagination.entity';
import { ObjectType } from '@nestjs/graphql';
import { Tag } from './tag.entity';

@ObjectType()
export class TagsPaginated extends Paginated(Tag) {}
