import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ActivateAccountPayload {
  @Field()
  accountActivated: boolean;
}
