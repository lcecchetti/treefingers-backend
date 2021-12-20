import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { User } from 'src/user/user.entity';

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
    ref: User.name,
    index: true,
  })
  author: User;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: Story.name,
    index: true,
    default: null,
  })
  root?: Story;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: Story.name,
    index: true,
    default: null,
  })
  parent?: Story;

  @Prop({
    min: 0,
    default: 0,
  })
  @Field(() => Int, { defaultValue: 0 })
  likesCount: number;

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
}

export type StoryDocument = Story & Document;
export const StorySchema = SchemaFactory.createForClass(Story);
