import { Paginated } from 'src/pagination/pagination.entity';
import { ObjectType } from '@nestjs/graphql';
import { Story } from './story.entity';

@ObjectType()
export class StoryConnection extends Paginated(Story) {}
