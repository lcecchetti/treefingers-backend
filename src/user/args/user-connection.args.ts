import { ArgsType, Field } from '@nestjs/graphql';
import { ConnectionArgs } from 'src/pagination/args/connection.args';
import { FilterUserInput } from '../inputs/filter-user.input';
import { SortUserInput } from '../inputs/sort-user.input';

@ArgsType()
export class UserConnectionArgs extends ConnectionArgs {
  @Field(() => FilterUserInput, { nullable: true })
  readonly filter?: FilterUserInput = new FilterUserInput();

  @Field(() => SortUserInput, { nullable: true })
  readonly sort?: SortUserInput = new SortUserInput();
}
