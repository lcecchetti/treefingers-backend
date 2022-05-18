import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';
import { User } from 'src/user/user.entity';
import { Forest } from 'src/forest/forest.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@Index(['memberId', 'forestId'], { unique: true })
@ObjectType()
export class Membership {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @ManyToOne(() => Forest, (forest) => forest.memberships)
  @Field(() => Forest)
  forest: Forest;

  @Column()
  @Index()
  forestId: number;

  @ManyToOne(() => User, (user) => user.memberships)
  @Field(() => User)
  member: User;

  @Column()
  @Index()
  memberId: number;

  @CreateDateColumn()
  @Field(() => GraphQLISODateTime)
  createdAt: Date;

  @UpdateDateColumn()
  @Field(() => GraphQLISODateTime)
  updatedAt: Date;
}
