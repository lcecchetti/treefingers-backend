import { Field, InputType } from '@nestjs/graphql';
import { FilterInput } from 'src/common/filter/dto/filter.input';

@InputType()
export class UserFilterInput extends FilterInput {
  @Field({ nullable: true })
  email?: string;
}
