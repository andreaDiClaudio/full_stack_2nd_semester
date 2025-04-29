import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { json, urlencoded } from 'express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';  // Import Swagger dependencies

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configure Swagger
  const config = new DocumentBuilder()
    .setTitle('My API')  // Set your API title
    .setDescription('API documentation for my NestJS app')  
    .setVersion('1.0')  // Set the version
    .addTag('users')  // Optional, you can add tags to group your endpoints
    .build();

  const document = SwaggerModule.createDocument(app, config);  // Generate Swagger document
  SwaggerModule.setup('api-docs', app, document);  // Set up Swagger UI endpoint

  // Middleware to parse request bodies
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  // Enable global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(3000, '0.0.0.0', () => {
    console.log('Server running on http://192.168.0.87:3000');
  });
}
bootstrap();
