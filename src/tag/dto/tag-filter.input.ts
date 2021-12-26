import { Field, InputType } from '@nestjs/graphql';
import {
  FilterStringInput,
  FilterInput,
} from 'src/common/filter/dto/filter.input';

@InputType()
export class TagFilterInput extends FilterInput {
  @Field(() => [TagFilterInput], { nullable: true })
  and?: [TagFilterInput];

  @Field(() => [TagFilterInput], { nullable: true })
  or?: [TagFilterInput];

  @Field(() => FilterStringInput, { nullable: true })
  readonly slug?: FilterStringInput;
}
