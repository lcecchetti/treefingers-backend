import { Field, ID, InputType } from '@nestjs/graphql';
import { MaxLength } from 'class-validator';
import { CommentableEntityType } from '../enums/commentable-entity-type.enum';

@InputType()
export class CommentDataInput {
  @Field()
  @MaxLength(512)
  content: string;

  @Field(() => ID)
  entityId: number;

  @Field(() => CommentableEntityType)
  entityType: CommentableEntityType;

  userId: number;
}

@InputType({ isAbstract: true })
export abstract class CommentInput {
  @Field(() => CommentDataInput)
  data: CommentDataInput;
}
