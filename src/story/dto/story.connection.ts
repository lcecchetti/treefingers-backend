import { Paginated } from 'src/common/pagination/dto/pagination.dto';
import { ObjectType } from '@nestjs/graphql';
import { Story } from '../story.entity';

@ObjectType()
export class StoryConnection extends Paginated(Story) {}
