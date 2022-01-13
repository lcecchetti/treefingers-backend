import { Field, ObjectType } from '@nestjs/graphql';
import { DeleteResultPayload } from 'src/query/args/delete-result.payload';
import { Like } from '../like.entity';

@ObjectType()
export class DeleteLikePayload {
  @Field(() => Like, { nullable: true })
  readonly like?: Like;

  @Field(() => DeleteResultPayload, { nullable: true })
  readonly result?: DeleteResultPayload;
}
