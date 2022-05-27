import { Field, ObjectType } from '@nestjs/graphql';
import { HashedIDScalar } from 'src/common/scalars/hashed-id.scalar';

@ObjectType()
export class CurrentUser {
  @Field(() => HashedIDScalar)
  id: number;

  @Field()
  username: string;

  @Field()
  email: string;
}
