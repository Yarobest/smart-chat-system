import { config } from 'dotenv';
import { resolve } from 'path';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

config({ path: resolve(__dirname, '../../../.env') });
config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: true,
    credentials: true,
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Smart Chat System API')
    .setDescription('Authentication, direct chat, and group chat API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, swaggerDocument, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const port = 4001;

  await app.listen(port, '0.0.0.0');

  console.log(`Backend running on http://localhost:${port}`);
  console.log(`Swagger docs running on http://localhost:${port}/docs`);
}
bootstrap();
