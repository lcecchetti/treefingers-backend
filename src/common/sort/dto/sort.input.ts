import { Field, InputType, registerEnumType } from '@nestjs/graphql';

export enum SORT_DIRECTION {
  ASC = 'asc',
  DESC = 'desc',
}

@InputType()
export class SortInput {
  @Field(() => SORT_DIRECTION, { nullable: true })
  _id = SORT_DIRECTION.ASC;
}

registerEnumType(SORT_DIRECTION, { name: 'Direction' });
