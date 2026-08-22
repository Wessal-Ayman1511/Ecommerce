import { SetMetadata } from '@nestjs/common';

export const IS_GRAPHQL = "isGraphQL";
export const isGraphQL = () => SetMetadata(IS_GRAPHQL, true);
