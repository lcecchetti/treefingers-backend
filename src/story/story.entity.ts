import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { User } from 'src/user/user.entity';

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

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: User.name,
    index: true,
  })
  author: User;
}

export type StoryDocument = Story & Document;
export const StorySchema = SchemaFactory.createForClass(Story);
