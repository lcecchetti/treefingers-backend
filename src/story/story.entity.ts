import { Field, GraphQLISODateTime, Int, ObjectType } from '@nestjs/graphql';
import { User } from 'src/user/user.entity';
import { Forest } from 'src/forest/forest.entity';
import { Likeable } from 'src/like/interfaces/likeable.interface';
import { Like } from 'src/like/like.entity';
import { Commentable } from 'src/comment/interfaces/commentable.interface';
import {
  Entity,
  Formula,
  Index,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { LikeableEntityType } from 'src/like/enums/likeable-entity-type.enum';
import { CommentableEntityType } from 'src/comment/enums/commentable-entity-type.enum';
import { HashedIDScalar } from 'src/common/scalars/hashed-id.scalar';

@Entity()
@ObjectType({
  implements: () => [Likeable, Commentable],
})
export class Story implements Likeable, Commentable {
  @PrimaryKey()
  @Field(() => HashedIDScalar)
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

  @ManyToOne(() => Story, { nullable: true, onDelete: 'cascade' })
  @Index()
  parent?: Story;

  @ManyToOne(() => Story, { nullable: true, onDelete: 'cascade' })
  @Index()
  root?: Story;

  @Property({ type: 'number[]', default: [] })
  @Index()
  @Field(() => [HashedIDScalar])
  path: number[];

  @Property({ default: [] })
  @Index()
  @Field(() => [String], { defaultValue: [] })
  tags: string[];

  @ManyToOne(() => Forest, { nullable: true })
  @Index()
  forest?: Forest;

  @Formula(
    `(select count(distinct c.id) as cnt from comment as c where c.entity = s0.id and c.entity_type = '${CommentableEntityType.Story}')`,
  )
  @Field(() => Int, { defaultValue: 0 })
  commentsCount: number;

  @Formula(
    `(select count(distinct l.id) as cnt from "like" as l where l.entity = s0.id and l.entity_type = '${LikeableEntityType.Story}')`,
  )
  @Field(() => Int, { defaultValue: 0 })
  likesCount: number;

  @Formula(
    '(select count(distinct d.id) as cnt from story as d where d.root_id = s0.id)',
  )
  @Field(() => Int, { defaultValue: 0 })
  descendentsCount: number;

  @Formula(
    '(select count(distinct c.id) as cnt from story as c where c.parent_id = s0.id)',
  )
  @Field(() => Int, { defaultValue: 0 })
  childrenCount: number;

  @Field(() => Like, { nullable: true })
  currentUserLike: Like;

  @Property({ onCreate: () => new Date() })
  @Field(() => GraphQLISODateTime)
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  @Field(() => GraphQLISODateTime)
  updatedAt: Date = new Date();
}
