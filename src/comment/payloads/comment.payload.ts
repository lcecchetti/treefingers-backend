import { Field, ObjectType } from '@nestjs/graphql';
import { Comment } from '../comment.entity';

@ObjectType({ isAbstract: true })
export abstract class CommentPayload {
  @Field(() => Comment)
  readonly comment: Comment;
}
