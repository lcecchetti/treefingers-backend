import { Field, InputType, registerEnumType } from '@nestjs/graphql';

export enum SortDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}

@InputType()
export class SortInput {
  @Field(() => SortDirection, { nullable: true })
  id: SortDirection = SortDirection.DESC;
}

registerEnumType(SortDirection, { name: 'SortDirection' });
