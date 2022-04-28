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
import { Likeable } from 'src/like/interfaces/likeable.interface';
import { LikeableEntityType } from 'src/like/enums/likeable-entity-type.enum';
import { Like } from 'src/like/like.entity';
import { Commentable } from './interfaces/commentable.interface';
import { CommentableEntityType } from './enums/commentable-entity-type.enum';

@Schema({ timestamps: true })
@ObjectType({
  implements: () => [Likeable],
})
export class Comment implements Likeable {
  @Field(() => ID)
  _id: string;

  likeableEntityType: LikeableEntityType;

  @Prop({
    required: true,
    minlength: 1,
    maxlength: 511,
  })
  @Field()
  content: string;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'User',
    index: true,
  })
  @Field(() => User)
  user: User;

  @Prop({
    required: true,
    type: SchemaTypes.ObjectId,
    refPath: 'entityType',
    index: true,
  })
  @Field(() => Commentable)
  entity: Commentable;

  @Prop({
    type: String,
    required: true,
    index: true,
    enum: CommentableEntityType,
  })
  @Field(() => CommentableEntityType)
  entityType: CommentableEntityType;

  @Prop({
    required: true,
    index: true,
    min: 0,
    default: 0,
  })
  @Field(() => Int, { defaultValue: 0 })
  likesCount: number;

  @Field(() => Like, { nullable: true })
  currentUserLike: Like;

  @Prop({ default: Date.now })
  @Field(() => GraphQLISODateTime)
  createdAt: Date;

  @Prop({ default: Date.now })
  @Field(() => GraphQLISODateTime)
  updatedAt: Date;
}

export type CommentDocument = Comment & Document;
const CommentSchema = SchemaFactory.createForClass(Comment);

CommentSchema.index({ likesCount: 1, _id: 1 });

export { CommentSchema };
