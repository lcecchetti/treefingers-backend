import { Field, ObjectType } from '@nestjs/graphql';
import { DeleteResultPayload } from 'src/query/args/delete-result.payload';
import { User } from '../user.entity';

@ObjectType()
export class UpdateUserPayload {
  @Field(() => User, { nullable: true })
  user: User;

  @Field(() => DeleteResultPayload, { nullable: true })
  result: DeleteResultPayload;
}
