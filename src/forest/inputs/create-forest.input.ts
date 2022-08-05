import { Field, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { Matches, MaxLength, ValidateNested } from 'class-validator';
import { EditForestDataInput } from './edit-forest.input';

@InputType()
export class CreateForestDataInput extends EditForestDataInput {
  @Field()
  @MaxLength(21)
  @Matches(/^[a-zA-Z0-9-_]+$/)
  name: string;

  founder: number;
}
@InputType()
export class CreateForestInput {
  @Field(() => CreateForestDataInput)
  @ValidateNested()
  @Type(() => CreateForestDataInput)
  data: CreateForestDataInput;
}
