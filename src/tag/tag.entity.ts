import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { MaxLength, Min, MinLength } from 'class-validator';

@Schema({ timestamps: true })
@ObjectType()
export class Tag {
  @Field(() => ID)
  _id: string;

  @Prop({
    required: true,
    index: true,
    minlength: 1,
    maxlength: 63,
  })
  @Field()
  @MinLength(1)
  @MaxLength(63)
  label: string;

  @Prop({
    required: true,
    index: true,
    minlength: 1,
    maxlength: 63,
  })
  @Field()
  @MinLength(1)
  @MaxLength(63)
  slug: string;

  @Prop({
    min: 0,
    default: 0,
  })
  @Field(() => Int)
  @Min(0)
  storiesCount: number;
}

export type TagDocument = Tag & Document;
export const TagSchema = SchemaFactory.createForClass(Tag);
