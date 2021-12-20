import { InputType } from '@nestjs/graphql';
import { RegisterInput } from 'src/auth/dto/register.input';

@InputType()
export class UserCreateInput extends RegisterInput {}
