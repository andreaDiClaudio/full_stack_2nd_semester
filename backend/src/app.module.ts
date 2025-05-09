// Step 1: Copy and paste this in the app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CategoryModule } from './category/category.module';
import { dbConfig } from 'data.source';
import { EntryModule } from './entry/entry.module';
import { AuthModule } from './authentication/auth.module';
import { ImageModule } from './image/image.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(dbConfig),
    CategoryModule,
    EntryModule,
    AuthModule,
    ImageModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
