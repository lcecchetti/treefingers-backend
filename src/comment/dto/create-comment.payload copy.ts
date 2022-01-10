import { Field, ObjectType } from '@nestjs/graphql';
import { Comment } from '../comment.entity';

@ObjectType()
export class CreateCommentPayload {
  @Field(() => Comment)
  readonly comment: Comment;
}
