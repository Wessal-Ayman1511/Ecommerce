import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class PaginateRespone {
  @Field(() => Int)
  totalSize: number;
  @Field(() => Int)
  totalPages: number;
  @Field(() => Int)
  pageSize: number;
  @Field(() => Int)
  pageNumber: number;
}