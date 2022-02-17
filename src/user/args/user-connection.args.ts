import { ArgsType, Field } from '@nestjs/graphql';
import { ConnectionArgs } from 'src/query/args/connection.args';
import { SortInput } from 'src/query/inputs/sort.input';
import { FilterUserInput } from '../inputs/filter-user.input';

@ArgsType()
export class UserConnectionArgs extends ConnectionArgs {
  @Field(() => FilterUserInput, { nullable: true })
  filter?: FilterUserInput;

  @Field({ nullable: true })
  readonly sort?: SortInput = new SortInput();
}
