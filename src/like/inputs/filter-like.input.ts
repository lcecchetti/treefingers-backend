import { Field, InputType } from '@nestjs/graphql';
import {
  FilterIdInput,
  FilterInput,
  FilterStringInput,
} from 'src/filter/inputs/filter.input';

@InputType()
export class FilterLikeInput extends FilterInput {
  @Field(() => FilterIdInput, { nullable: true })
  readonly entity?: FilterIdInput;

  @Field(() => FilterStringInput, { nullable: true })
  readonly entityType?: FilterStringInput;

  @Field(() => FilterIdInput, { nullable: true })
  readonly user?: FilterIdInput;
}
