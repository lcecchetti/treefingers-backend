import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '../user.entity';

@ObjectType()
export class EditUserPayload {
  @Field(() => User)
  user: User;
}
