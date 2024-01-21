import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  const PORT = process.env.PORT;
  const HOST = process.env.HOST;
  await app.listen(PORT);

  console.log(`server run on port http://${HOST}:${PORT}`);
}
bootstrap();
