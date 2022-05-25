import {
  Field,
  GraphQLISODateTime,
  ID,
  Int,
  ObjectType,
} from '@nestjs/graphql';
import { User } from 'src/user/user.entity';
import { Commentable } from 'src/comment/interfaces/commentable.interface';
import { Membership } from 'src/membership/membership.entity';
import { Story } from 'src/story/story.entity';
import {
  Collection,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';

@Entity()
@ObjectType({
  implements: () => [Commentable],
})
export class Forest implements Commentable {
  @PrimaryKey()
  @Field(() => ID)
  id: number;

  @Property()
  @Unique()
  @Field()
  name: string;

  @Property({ type: 'text' })
  @Index()
  @Field()
  about: string;

  @ManyToOne(() => User)
  @Index()
  @Field(() => User)
  founder: User;

  @Field(() => Int, { defaultValue: 0 })
  commentsCount: number;

  @Field(() => Int, { defaultValue: 0 })
  membersCount: number;

  @Field(() => Int, { defaultValue: 0 })
  storiesCount: number;

  @OneToMany(() => Membership, (membership) => membership.forest)
  memberships = new Collection<Membership>(this);

  @OneToMany(() => Story, (story) => story.forest)
  stories = new Collection<Story>(this);

  @Property({ onCreate: () => new Date() })
  @Field(() => GraphQLISODateTime)
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  @Field(() => GraphQLISODateTime)
  updatedAt: Date = new Date();
}
