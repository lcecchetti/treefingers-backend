import { Field, GraphQLISODateTime, Int, ObjectType } from '@nestjs/graphql';
import { User } from 'src/user/user.entity';
import { Like } from 'src/like/like.entity';
import { CommentableEntityType } from './enums/commentable-entity-type.enum';
import {
  Entity,
  Enum,
  Formula,
  Index,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { EncodedID } from 'src/common/scalars/encoded-id.scalar';
import { Likeable } from 'src/like/interfaces/likeable.interface';

@Entity()
@Index({ properties: ['entityType', 'entity'] })
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

  @Enum(() => CommentableEntityType)
  @Index()
  @Field(() => CommentableEntityType)
  entityType: CommentableEntityType;

  @Property({ type: 'number' })
  @Index()
  entity: number;

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
