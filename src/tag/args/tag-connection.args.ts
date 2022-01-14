import { ArgsType, Field } from '@nestjs/graphql';
import { ConnectionArgs } from 'src/query/args/connection.args';
import { TagFilterInput } from '../inputs/tag-filter.input';

@ArgsType()
export class TagConnectionArgs extends ConnectionArgs {
  @Field(() => TagFilterInput, { nullable: true })
  filter?: TagFilterInput;
}
