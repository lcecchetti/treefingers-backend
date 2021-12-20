import { InputType, ArgsType } from '@nestjs/graphql';
import { ConnectionInput } from 'src/common/pagination/dto/connection.input';

@InputType()
@ArgsType()
export class UsersInput extends ConnectionInput {}
