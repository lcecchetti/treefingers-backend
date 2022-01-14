import { Field, InputType } from '@nestjs/graphql';
import { FilterInput, FilterStringInput } from 'src/query/inputs/filter.input';

@InputType()
export class UserFilterInput extends FilterInput {
  @Field(() => [UserFilterInput], { nullable: true })
  and?: [UserFilterInput];

  @Field(() => [UserFilterInput], { nullable: true })
  or?: [UserFilterInput];

  @Field(() => FilterStringInput, { nullable: true })
  email?: FilterStringInput;

  @Field(() => FilterStringInput, { nullable: true })
  username?: FilterStringInput;
}
