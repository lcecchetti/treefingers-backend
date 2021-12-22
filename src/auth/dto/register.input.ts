import { InputType } from '@nestjs/graphql';
import { UserCreateDataInput } from 'src/user/dto/user-create.input';

@InputType()
export class RegisterInput extends UserCreateDataInput {}
