import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { Field, GraphQLISODateTime, ID, Int, ObjectType } from '@nestjs/graphql';
import { User } from 'src/user/user.entity';
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
  content: string;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: User.name,
    index: true,
  })
  @Field(() => User)
  user: User;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: Story.name,
    index: true,
  })
  @Field(() => Story)
  story: Story;

  @Prop({
    min: 0,
    default: 0,
  })
  @Field(() => Int, { defaultValue: 0 })
  likesCount: number;

  @Prop({ default: Date.now })
  @Field(() => GraphQLISODateTime)
  createdAt: Date;

  @Prop({ default: Date.now })
  @Field(() => GraphQLISODateTime)
  updatedAt: Date;
}

export type CommentDocument = Comment & Document;
export const CommentSchema = SchemaFactory.createForClass(Comment);
