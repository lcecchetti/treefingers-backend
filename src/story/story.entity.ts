import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Field, ID, ObjectType } from '@nestjs/graphql';

@Schema({ timestamps: true })
@ObjectType()
export class Story {
  @Field(() => ID)
  _id: string;

  @Prop({
    required: true,
    index: true,
  })
  @Field()
  title: string;
}

export type StoryDocument = Story & Document;
export const StorySchema = SchemaFactory.createForClass(Story);
