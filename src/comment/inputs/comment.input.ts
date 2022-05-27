import { Field, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { MaxLength, ValidateNested } from 'class-validator';
import { EncodedID } from 'src/common/scalars/encoded-id.scalar';
import { CommentableEntityType } from '../enums/commentable-entity-type.enum';

@InputType()
export class CommentDataInput {
  @Field()
  @MaxLength(512)
  content: string;

  @Field(() => EncodedID)
  entity: number;

  @Field(() => CommentableEntityType)
  entityType: CommentableEntityType;

  user: number;
}

@InputType({ isAbstract: true })
export abstract class CommentInput {
  @Field(() => CommentDataInput)
  @ValidateNested()
  @Type(() => CommentDataInput)
  data: CommentDataInput;
}
