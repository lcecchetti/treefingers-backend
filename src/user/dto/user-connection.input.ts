import { InputType, ArgsType, Field } from '@nestjs/graphql';
import { ConnectionInput } from 'src/common/pagination/dto/connection.input';
import { UserFilterInput } from './user-filter.input';

@InputType()
@ArgsType()
export class UserConnectionInput extends ConnectionInput {
  @Field(() => UserFilterInput, { nullable: true })
  filter?: UserFilterInput = new UserFilterInput();
}
