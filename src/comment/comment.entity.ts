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
import { Story } from 'src/story/story.entity';
import { Forest } from 'src/forest/forest.entity';
import { Likeable } from 'src/like/interfaces/likeable.interface';
import { LikeableEntityType } from 'src/like/enums/likeable-entity-type.enum';
import { Like } from 'src/like/like.entity';

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
    index: true,
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
    type: SchemaTypes.ObjectId,
    ref: 'Story',
    index: true,
  })
  @Field(() => Story, { nullable: true })
  story?: Story;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'Forest',
    index: true,
  })
  @Field(() => Forest, { nullable: true })
  forest?: Forest;

  @Field(() => Int)
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
export const CommentSchema = SchemaFactory.createForClass(Comment);
