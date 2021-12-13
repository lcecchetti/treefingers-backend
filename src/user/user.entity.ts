import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { IsEmail, isEmail, MaxLength, Min, MinLength } from 'class-validator';

@Schema({ timestamps: true })
@ObjectType()
export class User {
  @Field(() => ID)
  _id: string;

  @Prop({
    required: true,
    validate: [isEmail, 'Please fill a valid email address'],
    index: true,
  })
  @Field()
  @IsEmail()
  email: string;

  @Prop({
    required: true,
    minlength: 10,
  })
  @MinLength(10)
  password: string;

  @Prop({
    maxlength: 31,
  })
  @Field({ nullable: true })
  pseudonym?: string;

  @Prop({
    maxlength: 255,
  })
  @Field({ nullable: true })
  @MaxLength(255)
  bio?: string;

  @Prop({
    min: 0,
    default: 0,
  })
  @Field(() => Int, { defaultValue: 0 })
  @Min(0)
  likesCount: number;

  @Prop({
    min: 0,
    default: 0,
  })
  @Field(() => Int, { defaultValue: 0 })
  @Min(0)
  storiesCount: number;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
