import { ArgsType, Field } from '@nestjs/graphql';
import { ConnectionArgs } from 'src/query/args/connection.args';
import { UserFilterInput } from '../dto/user-filter.input';

@ArgsType()
export class UserConnectionArgs extends ConnectionArgs {
  @Field(() => UserFilterInput, { nullable: true })
  filter?: UserFilterInput;
}
