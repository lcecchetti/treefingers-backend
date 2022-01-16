import { ArgsType, Field } from '@nestjs/graphql';
import { ConnectionArgs } from 'src/query/args/connection.args';
import { FilterTagInput } from '../inputs/filter-tag.input';

@ArgsType()
export class TagConnectionArgs extends ConnectionArgs {
  @Field(() => FilterTagInput, { nullable: true })
  filter?: FilterTagInput;
}
