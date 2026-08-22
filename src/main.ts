import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { ResponseMappingInterceptor } from './common/interceptors';
import { HttpExceptionFilter } from './common/filters';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.set('query parser', 'extended');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  //app.useGlobalInterceptors(new ResponseMappingInterceptor()); 
  app.useGlobalFilters(new HttpExceptionFilter());

  const configService = app.get(ConfigService);

  const port = configService.get('PORT', 5000);

  await app.listen(port);
  console.log('Ecommerce running on port: ', port);
}
bootstrap();
