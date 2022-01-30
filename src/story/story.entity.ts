import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';
import { User } from 'src/user/user.entity';
import { Forest } from 'src/forest/forest.entity';
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
    index: true,
    trim: true,
  })
  @Field(() => [String], { nullable: true, defaultValue: [] })
  tags: string[];

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'Forest',
    index: true,
  })
  forest?: Forest;

  @Field(() => Like, { nullable: true })
  currentUserLike?: Like;

  @Prop({ default: Date.now })
  @Field(() => GraphQLISODateTime)
  createdAt: Date;

  @Prop({ default: Date.now })
  @Field(() => GraphQLISODateTime)
  updatedAt: Date;
}

export type StoryDocument = Story & Document;
const StorySchema = SchemaFactory.createForClass(Story);

StorySchema.index({ title: 'text', content: 'text' });

export { StorySchema };
