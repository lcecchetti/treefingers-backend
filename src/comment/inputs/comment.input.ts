import { Field, InputType } from '@nestjs/graphql';
import { MaxLength } from 'class-validator';
import { HashedIDScalar } from 'src/common/scalars/hashed-id.scalar';
import { CommentableEntityType } from '../enums/commentable-entity-type.enum';

@InputType()
export class CommentDataInput {
  @Field()
  @MaxLength(512)
  content: string;

  @Field(() => HashedIDScalar)
  entity: number;

  @Field(() => CommentableEntityType)
  entityType: CommentableEntityType;

  user: number;
}

@InputType({ isAbstract: true })
export abstract class CommentInput {
  @Field(() => CommentDataInput)
  data: CommentDataInput;
}
