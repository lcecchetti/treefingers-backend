import { Field, InputType, registerEnumType } from '@nestjs/graphql';

export enum SORT_DIRECTION {
  ASC = 'ASC',
  DESC = 'DESC',
}

@InputType()
export class SortInput {
  @Field(() => SORT_DIRECTION, { nullable: true })
  id: SORT_DIRECTION = SORT_DIRECTION.DESC;
}

registerEnumType(SORT_DIRECTION, { name: 'SortDirection' });
