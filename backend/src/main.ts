import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { json, urlencoded } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(json({limit: '50mb'}))
  app.use(urlencoded({extended:true, limit:'50mb'}))
    // Enable global validation pipe
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true, // Strip properties that do not have decorators
      forbidNonWhitelisted: true, // Throw an error if non-whitelisted properties are provided
      transform: true, // Automatically transform payloads to DTO instances
    }));
    app.listen(3000, '0.0.0.0', () => {
      console.log('Server running on http://192.168.0.87:3000');
    });
}
bootstrap();
