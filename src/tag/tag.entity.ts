import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import {
  Field,
  GraphQLISODateTime,
  ID,
  Int,
  ObjectType,
} from '@nestjs/graphql';

@Schema({ timestamps: true })
@ObjectType()
export class Tag {
  @Field(() => ID)
  _id: string;

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
  label: string;

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
    min: 0,
    default: 0,
    index: true,
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

export type TagDocument = Tag & Document;
const TagSchema = SchemaFactory.createForClass(Tag);

TagSchema.index({ label: 'text' });

export { TagSchema };
