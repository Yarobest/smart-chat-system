import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: true,
    credentials: true,
  });

  const port = 4001;

  await app.listen(port, '0.0.0.0');

  console.log(`Backend running on http://localhost:${port}`);
}
bootstrap();
