import { Field, ObjectType } from '@nestjs/graphql';
import { Like } from 'src/like/like.entity';

@ObjectType({ isAbstract: true })
export class CurrentUserData {
  @Field(() => Like, { nullable: true })
  like?: Like;
}
