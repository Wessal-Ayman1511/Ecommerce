import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);


  const configService = app.get(ConfigService)
  const port = configService.get('PORT', 5000)

  await app.listen(port);
  console.log("Ecommerce running on port: ", port)
}
bootstrap();
