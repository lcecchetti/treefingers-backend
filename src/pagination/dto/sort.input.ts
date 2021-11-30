import { Field, InputType, registerEnumType } from '@nestjs/graphql';

export enum DIRECTION {
  ASC = 'asc',
  DESC = 'desc',
}

@InputType()
export class SortInput {
  @Field(() => DIRECTION, { nullable: true })
  id = DIRECTION.ASC;
}

registerEnumType(DIRECTION, { name: 'Direction' });
