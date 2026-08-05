import { Field, GraphQLISODateTime, Int, ObjectType } from '@nestjs/graphql';
import { User } from '../user/user.entity';
import { Forest } from '../forest/forest.entity';
import { Like } from '../like/like.entity';
import { Commentable } from '../comment/interfaces/commentable.interface';
import { Collection } from '@mikro-orm/core';
import {
  Entity,
  Formula,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/decorators/legacy';
import { EncodedID } from '../common/scalars/encoded-id.scalar';
import { Likeable } from '../like/interfaces/likeable.interface';

@Entity()
@ObjectType({
  implements: () => [Commentable],
})
export class Story implements Likeable, Commentable {
  @PrimaryKey()
  @Field(() => EncodedID)
  id: number;

  @Property()
  @Index()
  @Field()
  title: string;

  @Property({ type: 'text' })
  @Index()
  @Field()
  content: string;

  @ManyToOne(() => User)
  @Index()
  author: User;

  @ManyToOne(() => Story, { nullable: true, deleteRule: 'cascade' })
  @Index()
  parent?: Story;

  @ManyToOne(() => Story, { nullable: true, deleteRule: 'cascade' })
  @Index()
  root?: Story;

  @Property({ type: 'number[]', default: [] })
  @Index()
  @Field(() => [EncodedID])
  path: number[];

  @Property({ default: [] })
  @Index()
  @Field(() => [String], { defaultValue: [] })
  tags: string[];

  @ManyToOne(() => Forest, { nullable: true })
  @Index()
  forest?: Forest;

  @Formula(`(cardinality(s0.path))`)
  @Index()
  @Field(() => Int)
  depth: number;

  @OneToMany(() => Like, (like) => like.story)
  likes = new Collection<Like>(this);

  @Formula(
    '(select count(distinct c.id)::int as cnt from comment as c where c.story_id = s0.id)',
  )
  @Field(() => Int, { defaultValue: 0 })
  commentsCount: number;

  @Formula(
    `(select count(distinct l.id)::int as cnt from "like" as l where l.story_id = s0.id)`,
  )
  @Field(() => Int, { defaultValue: 0 })
  likesCount: number;

  @Formula(
    '(select count(distinct d.id)::int as cnt from story as d where d.root_id = s0.id)',
  )
  @Field(() => Int, { defaultValue: 0 })
  descendantsCount: number;

  @Formula(
    '(select count(distinct c.id)::int as cnt from story as c where c.parent_id = s0.id)',
  )
  @Field(() => Int, { defaultValue: 0 })
  childrenCount: number;

  @Field(() => Like, { nullable: true })
  currentUserLike: Like;

  @Field(() => Boolean, { defaultValue: false })
  isEditable: boolean;

  @Property({ onCreate: () => new Date(), length: 0 })
  @Field(() => GraphQLISODateTime)
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date(), length: 0 })
  @Field(() => GraphQLISODateTime)
  updatedAt: Date = new Date();
}
