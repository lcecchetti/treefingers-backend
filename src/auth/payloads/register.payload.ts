import { ObjectType } from '@nestjs/graphql';
import { LoginPayload } from './login.payload';

@ObjectType()
export class RegisterPayload extends LoginPayload {}
