import { Field, GraphQLISODateTime, Int, ObjectType } from '@nestjs/graphql';
import { User } from '../user/user.entity';
import { Like } from '../like/like.entity';
import {
  Check,
  Entity,
  Formula,
  Index,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/decorators/legacy';
import { EncodedID } from '../common/scalars/encoded-id.scalar';
import { Likeable } from '../like/interfaces/likeable.interface';
import { Story } from '../story/story.entity';
import { Forest } from '../forest/forest.entity';

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
  @Index()
  @Field()
  content: string;

  @ManyToOne(() => User)
  @Index()
  @Field(() => User)
  user: User;

  @ManyToOne(() => Story, { nullable: true, deleteRule: 'cascade' })
  @Index()
  @Field(() => Story, { nullable: true })
  story?: Story;

  @ManyToOne(() => Forest, { nullable: true, deleteRule: 'cascade' })
  @Index()
  @Field(() => Forest, { nullable: true })
  forest?: Forest;

  @Formula(
    '(select count(distinct l.id)::int as cnt from "like" as l where l.comment_id = c0.id)',
  )
  @Field(() => Int, { defaultValue: 0 })
  likesCount: number;

  @Field(() => Like, { nullable: true })
  currentUserLike: Like;

  @Property({ onCreate: () => new Date(), length: 0 })
  @Field(() => GraphQLISODateTime)
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date(), length: 0 })
  @Field(() => GraphQLISODateTime)
  updatedAt: Date = new Date();
}
