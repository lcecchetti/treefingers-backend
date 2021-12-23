import { Field, InputType } from '@nestjs/graphql';
import {
  FilterStringInput,
  FilterInput,
} from 'src/common/filter/dto/filter.input';

@InputType()
export class UserFilterInput extends FilterInput {
  @Field(() => FilterStringInput, { nullable: true })
  email?: FilterStringInput;
}
