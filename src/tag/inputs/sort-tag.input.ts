import { Field, InputType } from '@nestjs/graphql';
import { SORT_DIRECTION } from 'src/query/inputs/sort.input';

@InputType()
export class SortTagInput {
  @Field(() => SORT_DIRECTION, { nullable: true })
  storiesCount: SORT_DIRECTION;

  @Field(() => SORT_DIRECTION, { nullable: true })
  _id: SORT_DIRECTION = SORT_DIRECTION.DESC;
}
