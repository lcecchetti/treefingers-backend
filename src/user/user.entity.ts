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
import { Like } from 'src/like/like.entity';

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
  @Field()
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
    lowercase: true,
    trim: true,
  })
  @Field()
  username: string;

  @Prop({
    minlength: 2,
    maxlength: 20,
    index: true,
    unique: true,
    trim: true,
  })
  @Field({ nullable: true })
  pseudonym?: string;

  @Prop({
    maxlength: 255,
    trim: true,
  })
  @Field({ nullable: true })
  bio?: string;

  @Field(() => Like, { nullable: true })
  currentUserLike?: Like;

  @Prop({
    min: 0,
    default: 0,
    index: true,
  })
  @Field(() => Int, { defaultValue: 0 })
  likesCount?: number;

  @Prop({
    min: 0,
    default: 0,
    index: true,
  })
  @Field(() => Int, { defaultValue: 0 })
  storiesCount?: number;

  @Prop({ default: Date.now })
  @Field(() => GraphQLISODateTime)
  createdAt: Date;

  @Prop({ default: Date.now })
  @Field(() => GraphQLISODateTime)
  updatedAt: Date;
}

export type UserDocument = User & Document;
const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ pseudonym: 'text', username: 'text', bio: 'text' });

export { UserSchema };
