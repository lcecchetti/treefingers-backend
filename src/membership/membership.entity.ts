import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';
import { User } from 'src/user/user.entity';
import { Forest } from 'src/forest/forest.entity';

@Schema({ timestamps: true })
@ObjectType()
export class Membership {
  @Field(() => ID)
  _id: string;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'Forest',
    index: true,
    required: true,
  })
  @Field(() => Forest)
  forest: Forest;

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

export type MembershipDocument = Membership & Document;
const MembershipSchema = SchemaFactory.createForClass(Membership);

MembershipSchema.index(
  { user: 1, forest: 1 },
  {
    unique: true,
  },
);

export { MembershipSchema };
