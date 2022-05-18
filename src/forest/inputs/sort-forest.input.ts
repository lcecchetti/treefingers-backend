import { Field, InputType } from '@nestjs/graphql';
import { SORT_DIRECTION } from 'src/query/inputs/sort.input';

@InputType()
export class SortForestInput {
  @Field(() => SORT_DIRECTION, { nullable: true })
  id: SORT_DIRECTION = SORT_DIRECTION.DESC;
}
