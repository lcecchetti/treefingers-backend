import {
  Field,
  GraphQLISODateTime,
  ID,
  Int,
  ObjectType,
} from '@nestjs/graphql';
import { User } from 'src/user/user.entity';
import { Likeable } from 'src/like/interfaces/likeable.interface';
import { Like } from 'src/like/like.entity';
import { CommentableEntityType } from './enums/commentable-entity-type.enum';
import { Commentable } from './interfaces/commentable.interface';
import {
  Entity,
  Enum,
  Index,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';

@Entity()
@Index({ properties: ['entityType', 'entity'] })
@ObjectType({
  implements: () => [Likeable],
})
export class Comment implements Likeable {
  @PrimaryKey()
  @Field(() => ID)
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
