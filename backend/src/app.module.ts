// Step 1: Copy and paste this in the app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MovieModule } from './movie/movie.module';

@Module({
 imports: [
   ConfigModule.forRoot({ isGlobal: true }),
   TypeOrmModule.forRootAsync({
     imports: [ConfigModule],
     useFactory: (configService: ConfigService) => ({
       type: 'postgres',
       host: configService.get('DB_HOST'),
       port: +configService.get<number>('DB_PORT'),
       username: configService.get('DB_USERNAME'),
       password: configService.get('DB_PASSWORD'),
       database: configService.get('DB_NAME'),
       autoLoadEntities: true,
       synchronize: true,
     }),
     inject: [ConfigService],
   }),
   MovieModule,
 ],
 controllers: [AppController],
 providers: [AppService],
})
export class AppModule {}
