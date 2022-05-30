import { Field, GraphQLISODateTime, Int, ObjectType } from '@nestjs/graphql';
import { User } from 'src/user/user.entity';
import { Like } from 'src/like/like.entity';
import {
  Check,
  Entity,
  Formula,
  Index,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { EncodedID } from 'src/common/scalars/encoded-id.scalar';
import { Likeable } from 'src/like/interfaces/likeable.interface';
import { Story } from 'src/story/story.entity';
import { Forest } from 'src/forest/forest.entity';

@Entity()
@Check({
  expression: () => `story_id IS NOT NULL OR forest_id IS NOT NULL`,
})
@ObjectType()
export class Comment implements Likeable {
  @PrimaryKey()
  @Field(() => EncodedID)
  id: number;

  @Property({ type: 'text' })
  @Field()
  content: string;

  @ManyToOne(() => User)
  @Index()
  @Field(() => User)
  user: User;

  @ManyToOne(() => Story, { nullable: true, onDelete: 'cascade' })
  @Index()
  @Field(() => Story, { nullable: true })
  story?: Story;

  @ManyToOne(() => Forest, { nullable: true, onDelete: 'cascade' })
  @Index()
  @Field(() => Forest, { nullable: true })
  forest?: Forest;

  @Formula(
    `(select count(distinct l.id) as cnt from "like" as l where l.comment_id = c0.id)`,
  )
  @Field(() => Int, { defaultValue: 0 })
  likesCount: number;

  @Field(() => Like, { nullable: true })
  currentUserLike: Like;

  @Property({ onCreate: () => new Date() })
  @Field(() => GraphQLISODateTime)
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  @Field(() => GraphQLISODateTime)
  updatedAt: Date = new Date();
}
