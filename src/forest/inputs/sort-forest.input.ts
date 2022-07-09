import { Field, InputType } from '@nestjs/graphql';
import { SortDirection } from '../../query/inputs/sort.input';

@InputType()
export class SortForestInput {
  @Field(() => SortDirection, { nullable: true })
  membersCount: SortDirection;

  @Field(() => SortDirection, { nullable: true })
  id: SortDirection = SortDirection.DESC;
}
