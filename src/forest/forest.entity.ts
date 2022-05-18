import {
  Field,
  GraphQLISODateTime,
  ID,
  Int,
  ObjectType,
} from '@nestjs/graphql';
import { User } from 'src/user/user.entity';
import { Commentable } from 'src/comment/interfaces/commentable.interface';
import { CommentableEntityType } from 'src/comment/enums/commentable-entity-type.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ForestComment } from 'src/comment/forest-comment.entity';

@Entity()
@ObjectType({
  implements: () => [Commentable],
})
export class Forest implements Commentable {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  commentableEntityType: CommentableEntityType;

  @Column()
  @Index({ unique: true })
  @Field()
  name: string;

  @Column({ type: 'text' })
  @Index()
  @Field()
  about: string;

  @ManyToOne(() => User, (founder) => founder.forests)
  @JoinColumn()
  @Field(() => User)
  founder: User;

  @Column()
  @Index()
  founderId: number;

  @Field(() => Int, { defaultValue: 0 })
  commentsCount: number;

  @Field(() => Int, { defaultValue: 0 })
  membersCount: number;

  @Field(() => Int, { defaultValue: 0 })
  storiesCount: number;

  @OneToMany(() => ForestComment, (comment) => comment.entity)
  comments: Comment[];

  @CreateDateColumn()
  @Field(() => GraphQLISODateTime)
  createdAt: Date;

  @UpdateDateColumn()
  @Field(() => GraphQLISODateTime)
  updatedAt: Date;
}
