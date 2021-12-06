import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { User } from 'src/user/user.entity';
import { Story } from 'src/story/story.entity';
import { Comment } from 'src/comment/comment.entity';

@Schema({ timestamps: true })
@ObjectType()
export class Like {
  @Field(() => ID)
  _id: string;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: Story.name,
    index: true,
  })
  story?: Story;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: Comment.name,
    index: true,
  })
  comment?: Comment;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: User.name,
    index: true,
  })
  author?: User;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: User.name,
    index: true,
    required: true,
  })
  user: User;
}

export type LikeDocument = Like & Document;
export const LikeSchema = SchemaFactory.createForClass(Like);
