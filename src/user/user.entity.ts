import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';
import { isPrivateMiddleware } from './middleware/is-private.middleware';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column()
  @Index({ unique: true })
  @Field({ middleware: [isPrivateMiddleware] })
  email: string;

  @Column()
  password?: string;

  @Column()
  @Index({ unique: true })
  @Field()
  username: string;

  @Column({ type: 'text', nullable: true })
  @Index()
  @Field({ nullable: true })
  bio?: string;

  @Column({ default: false })
  @Index()
  @Field({ defaultValue: false })
  isActive: boolean;

  @CreateDateColumn()
  @Field(() => GraphQLISODateTime, { middleware: [isPrivateMiddleware] })
  createdAt: Date;

  @UpdateDateColumn()
  @Field(() => GraphQLISODateTime, { middleware: [isPrivateMiddleware] })
  updatedAt: Date;
}
