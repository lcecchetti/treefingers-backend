import {
  Field,
  GraphQLISODateTime,
  ID,
  Int,
  ObjectType,
} from '@nestjs/graphql';
import { User } from 'src/user/user.entity';
import { Forest } from 'src/forest/forest.entity';
import { Likeable } from 'src/like/interfaces/likeable.interface';
import { Like } from 'src/like/like.entity';
import { Commentable } from 'src/comment/interfaces/commentable.interface';
import {
  ArrayType,
  Collection,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';

@Entity()
@ObjectType({
  implements: () => [Likeable, Commentable],
})
export class Story implements Likeable, Commentable {
  @PrimaryKey()
  @Field(() => ID)
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

  @OneToMany(() => Story, (chapter) => chapter.parent, { nullable: true })
  @Index()
  parent?: Story;

  @OneToMany(() => Story, (root) => root.descendents, { nullable: true })
  @Index()
  root?: Story;

  @ManyToOne(() => Story)
  chapters = new Collection<Story>(this);

  @Property({ type: ArrayType, nullable: true })
  @Index()
  @Field(() => [String], { nullable: true, defaultValue: [] })
  tags: string[];

  @ManyToOne(() => Forest)
  @Index()
  forest?: Forest;

  @ManyToOne(() => Story)
  descendents = new Collection<Story>(this);

  @Field(() => Int, { defaultValue: 0 })
  commentsCount: number;

  @Field(() => Int, { defaultValue: 0 })
  likesCount: number;

  @Field(() => Int, { defaultValue: 0 })
  descendentsCount: number;

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
