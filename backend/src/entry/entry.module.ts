import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntryService } from './entry.service';
import { EntryController } from './entry.controller';
import { Entry } from './entities/entry.entity';
import { Category } from 'src/category/entity/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Entry, Category])], // Import TypeOrmModule and include the Entry entity
  providers: [EntryService],
  controllers: [EntryController],
})
export class EntryModule {}
