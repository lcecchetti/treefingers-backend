import { Paginated } from 'src/common/pagination/dto/pagination.dto';
import { ObjectType } from '@nestjs/graphql';
import { Tag } from '../tag.entity';

@ObjectType()
export class TagsPaginated extends Paginated(Tag) {}
