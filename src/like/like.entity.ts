import {
  Check,
  Entity,
  Index,
  ManyToOne,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';
import { Field, GraphQLISODateTime, ObjectType } from '@nestjs/graphql';
import { EncodedID } from '../common/scalars/encoded-id.scalar';
import { Story } from '../story/story.entity';
import { User } from '../user/user.entity';
import { Comment } from '../comment/comment.entity';
@Entity()
@Check({
  expression: () => `story_id IS NOT NULL OR comment_id IS NOT NULL`,
})
@Unique({ properties: ['user', 'comment'] })
@Unique({ properties: ['user', 'story'] })
@ObjectType()
export class Like {
  @PrimaryKey()
  @Field(() => EncodedID)
  id: number;

  @ManyToOne(() => Story, { nullable: true, onDelete: 'cascade' })
  @Index()
  @Field(() => Story, { nullable: true })
  story?: Story;

  @ManyToOne(() => Comment, { nullable: true, onDelete: 'cascade' })
  @Index()
  @Field(() => Comment, { nullable: true })
  comment?: Comment;

  @ManyToOne(() => User)
  @Index()
  @Field(() => User)
  user: User;

  @Property({ onCreate: () => new Date() })
  @Field(() => GraphQLISODateTime)
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  @Field(() => GraphQLISODateTime)
  updatedAt: Date = new Date();
}
