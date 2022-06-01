import { Field, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import {
  IsOptional,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';

@InputType()
export class EditUserDataInput {
  @Field({ nullable: true })
  @MinLength(10)
  @IsOptional()
  password?: string;

  @Field({ nullable: true })
  @MaxLength(255)
  bio?: string;

  isActive?: boolean;
}

@InputType()
export class EditUserInput {
  @Field()
  @ValidateNested()
  @Type(() => EditUserDataInput)
  data: EditUserDataInput;
}
