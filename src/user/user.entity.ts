import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import {
  Field,
  GraphQLISODateTime,
  ID,
  Int,
  ObjectType,
} from '@nestjs/graphql';
import { isEmail } from 'class-validator';
import { isPrivateMiddleware } from './middleware/is-private.middleware';

@Schema({ timestamps: true })
@ObjectType()
export class User {
  @Field(() => ID)
  _id: string;

  @Prop({
    required: true,
    validate: [isEmail, 'Please fill a valid email address'],
    index: true,
    unique: true,
    trim: true,
  })
  @Field({ middleware: [isPrivateMiddleware] })
  email: string;

  @Prop({
    required: true,
    minlength: 10,
  })
  password?: string;

  @Prop({
    maxlength: 31,
    index: true,
    unique: true,
    trim: true,
    match: [
      /^[a-zA-Z0-9-_]+$/,
      'Only letters, numbers, dots, hyphens and dashes',
    ],
  })
  @Field()
  username: string;

  @Prop({
    maxlength: 255,
    trim: true,
  })
  @Field({ nullable: true })
  bio?: string;

  @Prop({
    required: true,
    index: true,
    min: 0,
    default: 0,
  })
  @Field(() => Int, { defaultValue: 0 })
  likesCount: number;

  @Prop({
    required: true,
    index: true,
    min: 0,
    default: 0,
  })
  @Field(() => Int, { defaultValue: 0 })
  storiesCount: number;

  @Prop({
    required: true,
    index: true,
    min: 0,
    default: 0,
  })
  @Field(() => Int, { defaultValue: 0 })
  followersCount: number;

  @Prop({ default: Date.now })
  @Field(() => GraphQLISODateTime, { middleware: [isPrivateMiddleware] })
  createdAt: Date;

  @Prop({ default: Date.now })
  @Field(() => GraphQLISODateTime, { middleware: [isPrivateMiddleware] })
  updatedAt: Date;
}

export type UserDocument = User & Document;
const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ username: 'text', bio: 'text' });
UserSchema.index({ followersCount: 1, _id: 1 });
UserSchema.index({ likesCount: 1, _id: 1 });
UserSchema.index({ storiesCount: 1, _id: 1 });

export { UserSchema };
