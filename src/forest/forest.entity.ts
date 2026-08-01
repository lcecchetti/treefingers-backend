import { Field, GraphQLISODateTime, Int, ObjectType } from '@nestjs/graphql';
import { User } from '../user/user.entity';
import { Commentable } from '../comment/interfaces/commentable.interface';
import { Membership } from '../membership/membership.entity';
import { Story } from '../story/story.entity';
import { Collection } from '@mikro-orm/core';
import {
  Entity,
  Formula,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/decorators/legacy';
import { EncodedID } from '../common/scalars/encoded-id.scalar';

@Entity()
@ObjectType({
  implements: () => [Commentable],
})
export class Forest implements Commentable {
  @PrimaryKey()
  @Field(() => EncodedID)
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

  @Formula(
    '(select count(distinct c.id)::int as cnt from comment as c where c.forest_id = f0.id)',
  )
  @Field(() => Int, { defaultValue: 0 })
  commentsCount: number;

  @Formula(
    '(select count(distinct m.id)::int as cnt from membership as m where m.forest_id = f0.id)',
  )
  @Field(() => Int, { defaultValue: 0 })
  membersCount: number;

  @Formula(
    '(select count(distinct s.id)::int as cnt from story as s where s.forest_id = f0.id)',
  )
  @Field(() => Int, { defaultValue: 0 })
  storiesCount: number;

  @OneToMany(() => Membership, (membership) => membership.forest)
  memberships = new Collection<Membership>(this);

  @OneToMany(() => Story, (story) => story.forest)
  stories = new Collection<Story>(this);

  @Property({ onCreate: () => new Date(), length: 0 })
  @Field(() => GraphQLISODateTime)
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date(), length: 0 })
  @Field(() => GraphQLISODateTime)
  updatedAt: Date = new Date();
}
