import { Field, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { MaxLength, ValidateNested } from 'class-validator';
import { EncodedID } from '../../common/scalars/encoded-id.scalar';

@InputType()
export class EditForestDataInput {
  @Field()
  @MaxLength(4096)
  about: string;
}

@InputType()
export class EditForestInput {
  @Field(() => EditForestDataInput)
  @ValidateNested()
  @Type(() => EditForestDataInput)
  data: EditForestDataInput;

  @Field(() => EncodedID)
  id: number;
}
