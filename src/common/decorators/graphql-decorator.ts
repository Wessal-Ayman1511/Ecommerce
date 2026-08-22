import { SetMetadata } from '@nestjs/common';

export const IS_GRAPHQL = "isGraphQL";
export const Public = () => SetMetadata(IS_GRAPHQL, true);
