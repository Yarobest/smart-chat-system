import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:3000', // allow frontend
    credentials: true,
  });

  await app.listen(4001); // 👈 change port
  console.log('Backend running on http://localhost:4001');
}

bootstrap().catch((err) => {
  console.error('Error starting server:', err);
});
