import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
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
