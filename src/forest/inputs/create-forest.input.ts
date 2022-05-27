import { Field, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { Matches, MaxLength, ValidateNested } from 'class-validator';

@InputType()
export class CreateForestDataInput {
  @Field()
  @MaxLength(21)
  @Matches(/^[a-zA-Z0-9-_]+$/)
  name: string;

  @Field()
  @MaxLength(4096)
  about: string;

  founder: number;
}
@InputType()
export class CreateForestInput {
  @Field(() => CreateForestDataInput)
  @ValidateNested()
  @Type(() => CreateForestDataInput)
  data: CreateForestDataInput;
}
