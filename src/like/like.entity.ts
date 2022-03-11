import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';
import { User } from 'src/user/user.entity';
import { Likeable } from './interfaces/likeable.interface';
import { LikeableEntityType } from './enums/likeable-entity-type.enum';

@Schema({ timestamps: true })
@ObjectType()
export class Like {
  @Field(() => ID)
  _id: string;

  @Prop({
    required: true,
    type: SchemaTypes.ObjectId,
    refPath: 'entityType',
    index: true,
  })
  @Field(() => Likeable)
  entity: Likeable;

  @Prop({
    type: String,
    required: true,
    enum: LikeableEntityType,
  })
  @Field(() => LikeableEntityType)
  entityType: LikeableEntityType;

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

LikeSchema.index(
  { user: 1, entity: 1, entityType: 1 },
  {
    unique: true,
  },
);

export { LikeSchema };
