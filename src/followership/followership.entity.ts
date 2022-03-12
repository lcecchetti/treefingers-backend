import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';
import { User } from 'src/user/user.entity';

@Schema({ timestamps: true })
@ObjectType()
export class Followership {
  @Field(() => ID)
  _id: string;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'Forest',
    index: true,
    required: true,
  })
  @Field(() => User)
  user: User;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'User',
    index: true,
    required: true,
  })
  @Field(() => User)
  follower: User;

  @Prop({ default: Date.now })
  @Field(() => GraphQLISODateTime)
  createdAt: Date;

  @Prop({ default: Date.now })
  @Field(() => GraphQLISODateTime)
  updatedAt: Date;
}

export type FollowershipDocument = Followership & Document;
const FollowershipSchema = SchemaFactory.createForClass(Followership);

FollowershipSchema.index(
  { user: 1, follower: 1 },
  {
    unique: true,
  },
);

export { FollowershipSchema };
