import { Field, InputType } from '@nestjs/graphql';
import {
  FilterFieldStringInput,
  FilterInput,
} from 'src/common/filter/dto/filter.input';

@InputType()
export class UserFilterInput extends FilterInput {
  @Field(() => FilterFieldStringInput, { nullable: true })
  email?: FilterFieldStringInput;
}
