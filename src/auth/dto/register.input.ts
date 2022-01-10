import { InputType } from '@nestjs/graphql';
import { CreateUserDataInput } from 'src/user/dto/create-user.input';

@InputType()
export class RegisterInput extends CreateUserDataInput {}
