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
    minlength: 1,
    maxlength: 63,
    trim: true,
  })
  @Field()
  name: string;

  @Prop({
    required: true,
    index: true,
    unique: true,
    minlength: 1,
    maxlength: 63,
    lowercase: true,
    trim: true,
  })
  @Field()
  slug: string;

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
  owner: User;

  @Field(() => Int)
  commentsCount: number;

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
