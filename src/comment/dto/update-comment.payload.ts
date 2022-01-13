import { Field, ObjectType } from '@nestjs/graphql';
import { UpdateResultPayload } from 'src/query/args/update-result.payload';

@ObjectType()
export class UpdateCommentPayload {
  @Field(() => Comment, { nullable: true })
  comment?: Comment;

  @Field(() => UpdateResultPayload, { nullable: true })
  result?: UpdateResultPayload;
}
