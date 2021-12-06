import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { User } from 'src/user/user.entity';
import { MaxLength, MinLength } from 'class-validator';
import { Story } from 'src/story/story.entity';

@Schema({ timestamps: true })
@ObjectType()
export class Comment {
  @Field(() => ID)
  _id: string;

  @Prop({
    required: true,
    index: true,
    minlength: 1,
    maxlength: 511,
  })
  @Field()
  @MinLength(1)
  @MaxLength(511)
  content: string;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: User.name,
    index: true,
  })
  @Field(() => User)
  author: User;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: Story.name,
    index: true,
  })
  @Field(() => Story)
  story: Story;
}

export type CommentDocument = Comment & Document;
export const CommentSchema = SchemaFactory.createForClass(Comment);
