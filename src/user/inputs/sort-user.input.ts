import { Field, InputType } from '@nestjs/graphql';
import { SORT_DIRECTION } from '../../query/inputs/sort.input';

@InputType()
export class SortUserInput {
  @Field(() => SORT_DIRECTION, { nullable: true })
  followersCount: SORT_DIRECTION;

  @Field(() => SORT_DIRECTION, { nullable: true })
  id: SORT_DIRECTION = SORT_DIRECTION.DESC;
}
