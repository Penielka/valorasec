import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  // Global prefix
  app.setGlobalPrefix('api');

  // CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN ?? 'http://localhost:3000',
    credentials: true,
  });

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('ValoraSec API')
    .setDescription('Open-source security platform for Soroban smart contracts on Stellar')
    .setVersion('0.1.0')
    .addBearerAuth()
    .addTag('Auth', 'Authentication endpoints')
    .addTag('Users', 'User management')
    .addTag('Projects', 'Project management')
    .addTag('Scans', 'Security scan operations')
    .addTag('Reports', 'Audit report management')
    .addTag('Audit Registry', 'On-chain audit verification')
    .addTag('Notifications', 'User notifications')
    .addTag('Health', 'System health checks')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });

  // Start
  const port = process.env.PORT ?? 4000;
  await app.listen(port);
  console.info(`🚀 ValoraSec API running on http://localhost:${port}`);
  console.info(`📚 Swagger docs: http://localhost:${port}/api/docs`);
}

void bootstrap();
