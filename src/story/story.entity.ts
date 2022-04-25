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
import { Forest } from 'src/forest/forest.entity';
import { Likeable } from 'src/like/interfaces/likeable.interface';
import { LikeableEntityType } from 'src/like/enums/likeable-entity-type.enum';
import { Like } from 'src/like/like.entity';
import { Commentable } from 'src/comment/interfaces/commentable.interface';
import { CommentableEntityType } from 'src/comment/enums/commentable-entity-type.enum';

@Schema({ timestamps: true })
@ObjectType({
  implements: () => [Likeable, Commentable],
})
export class Story implements Likeable, Commentable {
  @Field(() => ID)
  _id: string;

  likeableEntityType: LikeableEntityType;
  commentableEntityType: CommentableEntityType;

  @Prop({
    required: true,
    minlength: 1,
    maxlength: 255,
  })
  @Field()
  title: string;

  @Prop({
    required: true,
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

  @Prop({
    required: true,
    index: true,
    min: 0,
    default: 0,
  })
  @Field(() => Int, { defaultValue: 0 })
  commentsCount: number;

  @Prop({
    required: true,
    index: true,
    min: 0,
    default: 0,
  })
  @Field(() => Int, { defaultValue: 0 })
  likesCount: number;

  @Prop({
    required: true,
    index: true,
    min: 0,
    default: 0,
  })
  @Field(() => Int, { defaultValue: 0 })
  descendentsCount: number;

  @Prop({
    required: true,
    index: true,
    min: 0,
    default: 0,
  })
  @Field(() => Int, { defaultValue: 0 })
  childrenCount: number;

  @Field(() => Like, { nullable: true })
  currentUserLike: Like;

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
