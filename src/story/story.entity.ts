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
import { Tag } from 'src/tag/tag.entity';
import { Like } from 'src/like/like.entity';

@Schema({ timestamps: true })
@ObjectType()
export class Story {
  @Field(() => ID)
  _id: string;

  @Prop({
    required: true,
    index: true,
    minlength: 1,
    maxlength: 255,
  })
  @Field()
  title: string;

  @Prop({
    required: true,
    index: true,
  })
  @Field()
  content: string;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'User',
    index: true,
  })
  @Field(() => User)
  author: User;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'Story',
    index: true,
    sparse: true,
  })
  @Field(() => Story, { nullable: true })
  root?: Story;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'Story',
    index: true,
    sparse: true,
  })
  @Field(() => Story, { nullable: true })
  parent?: Story;

  @Prop({
    min: 0,
    default: 0,
  })
  @Field(() => Int, { defaultValue: 0 })
  likesCount: number;

  @Field(() => Like, { nullable: true })
  currentUserLike?: Like;

  @Prop({
    min: 0,
    default: 0,
  })
  @Field(() => Int, { defaultValue: 0 })
  commentsCount: number;

  @Prop({
    min: 0,
    default: 0,
  })
  @Field(() => Int, { defaultValue: 0 })
  childrenCount: number;

  @Prop({
    min: 0,
    default: 0,
  })
  @Field(() => Int, { defaultValue: 0 })
  descendentsCount: number;

  @Prop({
    type: [SchemaTypes.ObjectId],
    ref: 'Tag',
    index: true,
    default: null,
  })
  tags?: [Tag];

  @Prop({ default: Date.now })
  @Field(() => GraphQLISODateTime)
  createdAt: Date;

  @Prop({ default: Date.now })
  @Field(() => GraphQLISODateTime)
  updatedAt: Date;
}

export type StoryDocument = Story & Document;
export const StorySchema = SchemaFactory.createForClass(Story);
