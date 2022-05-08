import { Field, InputType } from '@nestjs/graphql';
import { SORT_DIRECTION } from 'src/pagination/inputs/sort.input';

@InputType()
export class SortForestInput {
  @Field(() => SORT_DIRECTION, { nullable: true })
  membersCount: SORT_DIRECTION;

  @Field(() => SORT_DIRECTION, { nullable: true })
  storiesCount: SORT_DIRECTION;

  @Field(() => SORT_DIRECTION, { nullable: true })
  _id: SORT_DIRECTION = SORT_DIRECTION.DESC;
}
