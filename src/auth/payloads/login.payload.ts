import { Field, ObjectType } from '@nestjs/graphql';
import { CurrentUser } from '../dto/current-user.dto';

@ObjectType()
export class LoginPayload {
  @Field()
  token: string;

  @Field()
  currentUser: CurrentUser;
}
