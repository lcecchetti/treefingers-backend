import { Field, ObjectType, Int } from '@nestjs/graphql';
import { Type } from '@nestjs/common';

interface Edge<T> {
  cursor: string;
  node: T;
}

@ObjectType()
class PageInfo {
  @Field()
  hasNextPage?: boolean;

  @Field({ nullable: true })
  startCursor?: string;

  @Field({ nullable: true })
  endCursor?: string;

  @Field(() => Int)
  totalCount?: number;

  @Field(() => Int)
  pagesCount?: number;

  @Field(() => Int)
  pageSize?: number;

  @Field(() => Int)
  currentPage?: number;
}

export interface IConnection<T> {
  edges?: Edge<T>[];
  pageInfo?: PageInfo;
}

export function Paginated<T>(classRef: Type<T>): Type<IConnection<T>> {
  @ObjectType(`${classRef.name}Edge`)
  abstract class EdgeType {
    @Field(() => String)
    cursor: string;

    @Field(() => classRef)
    node: T;
  }

  @ObjectType({ isAbstract: true })
  abstract class Connection implements IConnection<T> {
    @Field(() => [EdgeType], { nullable: true })
    edges: EdgeType[];

    @Field(() => PageInfo)
    pageInfo: PageInfo;
  }

  return Connection as Type<IConnection<T>>;
}
