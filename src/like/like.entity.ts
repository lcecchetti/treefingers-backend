import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';
import { User } from 'src/user/user.entity';
import { LikeableEntityType } from './enums/likeable-entity-type.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Likeable } from './interfaces/likeable.interface';

@Entity()
@Index(['user', 'entityId', 'entityType'], { unique: true })
@Index(['entityId', 'entityType'])
@ObjectType()
export class Like {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column({ type: 'enum', name: 'entityType', enum: LikeableEntityType })
  @Field(() => LikeableEntityType)
  entityType: LikeableEntityType;

  
  @Field(() => Likeable)
  entity: Likeable;

  @Column()
  @Index()
  entityId: number;

  @ManyToOne(() => User, (user) => user.likes)
  @Field(() => User)
  user: User;

  @Column()
  @Index()
  userId: number;

  @CreateDateColumn()
  @Field(() => GraphQLISODateTime)
  createdAt: Date;

  @UpdateDateColumn()
  @Field(() => GraphQLISODateTime)
  updatedAt: Date;
}
