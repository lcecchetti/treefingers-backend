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
import { Commentable } from 'src/comment/interfaces/commentable.interface';
import { CommentableEntityType } from 'src/comment/enums/commentable-entity-type.enum';

@Schema({ timestamps: true })
@ObjectType({
  implements: () => [Commentable],
})
export class Forest implements Commentable {
  @Field(() => ID)
  _id: string;

  commentableEntityType: CommentableEntityType;

  @Prop({
    required: true,
    unique: true,
    minlength: 2,
    maxlength: 32,
    trim: true,
    match: [
      /^[a-zA-Z0-9-_]+$/,
      'Only letters, numbers, dots, hyphens and dashes',
    ],
  })
  @Field()
  name: string;

  @Prop({
    required: true,
    minlength: 1,
    maxlength: 1024,
    trim: true,
  })
  @Field()
  about: string;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'User',
    index: true,
  })
  @Field(() => User)
  founder: User;

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
  membersCount: number;

  @Prop({
    required: true,
    index: true,
    min: 0,
    default: 0,
  })
  @Field(() => Int, { defaultValue: 0 })
  storiesCount: number;

  @Prop({ default: Date.now })
  @Field(() => GraphQLISODateTime)
  createdAt: Date;

  @Prop({ default: Date.now })
  @Field(() => GraphQLISODateTime)
  updatedAt: Date;
}

export type ForestDocument = Forest & Document;
const ForestSchema = SchemaFactory.createForClass(Forest);

ForestSchema.index({ name: 'text', about: 'text' });

export { ForestSchema };
