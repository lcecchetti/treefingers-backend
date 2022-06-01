import { ObjectType } from '@nestjs/graphql';
import { Paginated } from '../../pagination/dto/pagination.dto';
import { Story } from '../story.entity';

@ObjectType()
export class StoryConnection extends Paginated(Story) {}
