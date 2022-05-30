import { Field, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { MaxLength, ValidateNested } from 'class-validator';
import { EncodedID } from 'src/common/scalars/encoded-id.scalar';

@InputType()
export class CommentDataInput {
  @Field()
  @MaxLength(512)
  content: string;

  @Field(() => EncodedID, { nullable: true })
  story?: number;

  @Field(() => EncodedID, { nullable: true })
  forest?: number;

  user: number;
}

@InputType({ isAbstract: true })
export abstract class CommentInput {
  @Field(() => CommentDataInput)
  @ValidateNested()
  @Type(() => CommentDataInput)
  data: CommentDataInput;
}
