import { Field, InputType } from '@nestjs/graphql';
import { SortDirection } from '../../query/inputs/sort.input';

@InputType()
export class SortUserInput {
  @Field(() => SortDirection, { nullable: true })
  followersCount: SortDirection;

  @Field(() => SortDirection, { nullable: true })
  id: SortDirection = SortDirection.DESC;
}
