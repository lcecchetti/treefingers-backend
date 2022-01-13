import { Field, ObjectType } from '@nestjs/graphql';
import { DeleteLikePayload } from 'src/like/dto/delete-like.payload';
import { DeleteResultPayload } from 'src/query/args/delete-result.payload';
import { User } from '../user.entity';

@ObjectType()
export class UpdateUserPayload {
  @Field(() => User, { nullable: true })
  user?: User;

  @Field(() => DeleteResultPayload, { nullable: true })
  result?: DeleteLikePayload;
}
