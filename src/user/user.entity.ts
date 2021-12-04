import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { RegisterInput } from 'src/auth/dto/register.input';
import { IsEmail, isEmail, MinLength } from 'class-validator';

@Schema({ timestamps: true })
@ObjectType()
export class User extends RegisterInput {
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
    maxlength: 32,
  })
  @Field()
  pseudonym?: string;

  @Prop({
    maxlength: 255,
  })
  @Field()
  bio?: string;

  @Prop({
    min: 0,
  })
  @Field(() => Int)
  likesCount: number;

  @Prop({
    min: 0,
  })
  @Field(() => Int)
  storiesCount: number;

  /*@Field(() => StoryConnection)
  stories: StoryConnection;*/
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
