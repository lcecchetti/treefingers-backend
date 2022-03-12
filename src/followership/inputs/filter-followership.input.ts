import { Field, InputType } from '@nestjs/graphql';
import { FilterIdInput, FilterInput } from 'src/filter/inputs/filter.input';

@InputType()
export class FilterFollowershipInput extends FilterInput {
  @Field(() => FilterIdInput, { nullable: true })
  readonly user?: FilterIdInput;

  @Field(() => FilterIdInput, { nullable: true })
  readonly follower?: FilterIdInput;
}
