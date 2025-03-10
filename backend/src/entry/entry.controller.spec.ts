import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Entry } from './entities/entry.entity';
import { Category } from 'src/category/entity/category.entity';
import { EntryController } from './entry.controller';
import { EntryService } from './entry.service';
import * as request from 'supertest';  // Importing supertest
import { HttpStatus } from '@nestjs/common';

describe('EntryController', () => {
    let app;
    let entryRepository: Repository<Entry>;

    const mockCategories = [
      {id:1, title: 'Category 1' },
      { id:2,title: 'Category 2' },
    ];
  
    const mockEntries = [
      {id:1, title: 'Entry 1', amount: 10, category: mockCategories[0] },
      {id:2, title: 'Entry 2', amount: 20, category: mockCategories[1] },
    ];
  
    beforeAll(async () => {
      const module: TestingModule = await Test.createTestingModule({
        imports: [
          TypeOrmModule.forRoot({
            type: 'sqlite',
            database: ':memory:', // Use SQLite in-memory database
            entities: [Category, Entry],
            synchronize: true, // Automatically synchronize database schema
          }),
          TypeOrmModule.forFeature([Category, Entry]),
        ],
        controllers: [EntryController],
        providers: [EntryService],
      }).compile();
  
      app = module.createNestApplication();
      await app.init();
  
      entryRepository = module.get<Repository<Entry>>(getRepositoryToken(Entry));
    });
  
    afterEach(async () => {
      // Clean up any data from the database after each test run
      await entryRepository.clear();
    });
  

  it('should return a list of categories', async () => {
        await entryRepository.save(mockEntries);
  
        const response = await request(app.getHttpServer())
          .get('/category')
          .expect(HttpStatus.OK);
  
        // Check individual response fields
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('Entry retrieved successfully');
        expect(response.body.data).toEqual(mockEntries);
      });
  
});
