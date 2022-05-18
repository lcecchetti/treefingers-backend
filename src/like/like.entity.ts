import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';
import { User } from 'src/user/user.entity';
import { LikeableEntityType } from './enums/likeable-entity-type.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  TableInheritance,
  UpdateDateColumn,
} from 'typeorm';
import { Likeable } from './interfaces/likeable.interface';

@Entity()
@TableInheritance({ column: { type: 'varchar', name: 'entityType' } })
@Index(['user', 'entityId', 'entityType'], { unique: true })
@ObjectType()
export class Like {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column({
    type: 'enum',
    enum: LikeableEntityType,
  })
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
