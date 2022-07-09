import { Field, InputType } from '@nestjs/graphql';
import { SortDirection } from '../../query/inputs/sort.input';

@InputType()
export class SortStoryInput {
  @Field(() => SortDirection, { nullable: true })
  likesCount: SortDirection;

  @Field(() => SortDirection, { nullable: true })
  id: SortDirection = SortDirection.DESC;
}
