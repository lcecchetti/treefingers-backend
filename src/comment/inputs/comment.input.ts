import { Field, ID, InputType } from '@nestjs/graphql';
import { MaxLength } from 'class-validator';
import { CommentableEntityType } from '../enums/commentable-entity-type.enum';

@InputType()
export class CommentDataInput {
  @Field()
  @MaxLength(255)
  content: string;

  @Field(() => ID)
  entity: string;

  @Field(() => CommentableEntityType)
  entityType: CommentableEntityType;

  user: string;
}

@InputType({ isAbstract: true })
export abstract class CommentInput {
  @Field(() => CommentDataInput)
  data: CommentDataInput;
}
