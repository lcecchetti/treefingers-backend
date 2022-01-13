import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';
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
    ref: 'Story',
    index: true,
  })
  @Field(() => Story, { nullable: true })
  story?: Story;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'Comment',
    index: true,
  })
  @Field(() => Comment, { nullable: true })
  comment?: Comment;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'User',
    index: true,
  })
  @Field(() => User, { nullable: true })
  author?: User;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'User',
    index: true,
    required: true,
  })
  @Field(() => User)
  user: User;

  @Prop({ default: Date.now })
  @Field(() => GraphQLISODateTime)
  createdAt: Date;

  @Prop({ default: Date.now })
  @Field(() => GraphQLISODateTime)
  updatedAt: Date;
}

export type LikeDocument = Like & Document;

const LikeSchema = SchemaFactory.createForClass(Like);

//@todo move this to business logic instead?
LikeSchema.index({ user: 1, story: 1 }, { unique: true, sparse: true });
LikeSchema.index({ user: 1, comment: 1 }, { unique: true, sparse: true });
LikeSchema.index({ user: 1, author: 1 }, { unique: true, sparse: true });

export { LikeSchema };
