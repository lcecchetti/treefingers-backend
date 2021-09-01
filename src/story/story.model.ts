import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Field, ID, ObjectType } from '@nestjs/graphql';

@Schema()
@ObjectType()
export class Story {
  @Field(() => ID)
  id: string;

  @Prop()
  @Field()
  title: string;
}

export type StoryDocument = Story & Document;
export const StorySchema = SchemaFactory.createForClass(Story);
