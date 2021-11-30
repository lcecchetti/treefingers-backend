import { InputType, ArgsType } from '@nestjs/graphql';
import { PaginationInput } from 'src/pagination/dto/pagination.input';

@InputType()
@ArgsType()
export class UserConnectionInput extends PaginationInput {}
