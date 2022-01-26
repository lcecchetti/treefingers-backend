import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import {
  Field,
  GraphQLISODateTime,
  ID,
  Int,
  ObjectType,
} from '@nestjs/graphql';
import { User } from 'src/user/user.entity';

@Schema({ timestamps: true })
@ObjectType()
export class Forest {
  @Field(() => ID)
  _id: string;

  @Prop({
    required: true,
    index: true,
    unique: true,
    minlength: 1,
    maxlength: 63,
    trim: true,
  })
  @Field()
  name: string;

  @Prop({
    required: true,
    index: true,
    unique: true,
    minlength: 1,
    maxlength: 63,
    lowercase: true,
    trim: true,
  })
  @Field()
  slug: string;

  @Prop({
    required: true,
    minlength: 1,
    maxlength: 1024,
    trim: true,
  })
  @Field()
  about: string;

  @Prop({
    min: 0,
    default: 0,
    index: true,
  })
  @Field(() => Int, { defaultValue: 0 })
  storiesCount: number;

  @Prop({
    min: 0,
    default: 0,
    index: true,
  })
  @Field(() => Int, { defaultValue: 0 })
  likesCount?: number;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'User',
    index: true,
  })
  @Field(() => User)
  owner: User;

  @Prop({ default: Date.now })
  @Field(() => GraphQLISODateTime)
  createdAt: Date;

  @Prop({ default: Date.now })
  @Field(() => GraphQLISODateTime)
  updatedAt: Date;
}

export type ForestDocument = Forest & Document;
const ForestSchema = SchemaFactory.createForClass(Forest);

ForestSchema.index({ name: 'text' });

export { ForestSchema };
