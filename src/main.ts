import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = process.env.PORT;
  const HOST = process.env.HOST;
  await app.listen(PORT);

  console.log(`server run on port http://${HOST}:${PORT}`);
}
bootstrap();
