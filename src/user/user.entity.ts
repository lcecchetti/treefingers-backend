import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { RegisterInput } from 'src/auth/dto/register.input';
import { IsEmail, isEmail, MinLength } from 'class-validator';

@Schema({ timestamps: true })
@ObjectType()
export class User extends RegisterInput {
  @Field(() => ID)
  id: string;

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
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
