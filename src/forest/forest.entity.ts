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
  Formula,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';
import { CommentableEntityType } from 'src/comment/enums/commentable-entity-type.enum';

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

  @Formula(
    `(select count(distinct c.id) as cnt from comment as c where c.entity = f0.id and c.entity_type = '${CommentableEntityType.Forest}')`,
  )
  @Field(() => Int, { defaultValue: 0 })
  commentsCount: number;

  @Formula(
    '(select count(distinct m.id) as cnt from membership as m where m.forest_id = f0.id)',
  )
  @Field(() => Int, { defaultValue: 0 })
  membersCount: number;

  @Formula(
    '(select count(distinct s.id) as cnt from story as s where s.forest_id = f0.id)',
  )
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
