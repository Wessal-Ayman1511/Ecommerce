import { SetMetadata } from '@nestjs/common';

export const SKIP_INTERCEPTOR = "skipInterceptor";
export const skipInterceptor = () => SetMetadata(SKIP_INTERCEPTOR, true);
