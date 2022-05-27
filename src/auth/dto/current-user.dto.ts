import { Field, ObjectType } from '@nestjs/graphql';
import { EncodedID } from 'src/common/scalars/encoded-id.scalar';

@ObjectType()
export class CurrentUser {
  @Field(() => EncodedID)
  id: number;

  @Field()
  username: string;

  @Field()
  email: string;
}
