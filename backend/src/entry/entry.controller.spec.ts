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
    let categoryRepository: Repository<Category>;  // Add repository for Category

    const mockCategories = [
      {id: 1, title: 'Category 1' },
      {id: 2, title: 'Category 2' },
    ];
  
    const mockEntries = [
      {id: 1, title: 'Entry 1', amount: 10, category: mockCategories[0] },
      {id: 2, title: 'Entry 2', amount: 20, category: mockCategories[1] },
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
      categoryRepository = module.get<Repository<Category>>(getRepositoryToken(Category));  // Initialize Category repository
    });
  
    afterEach(async () => {
      // Clean up any data from the database after each test run
      await entryRepository.clear();
      await categoryRepository.clear();  // Clear categories as well
    });
  
    it('should return a list of categories', async () => {
      // Save categories first
      await categoryRepository.save(mockCategories);
  
      // Then save entries, now that categories are in the DB
      await entryRepository.save(mockEntries);
  
      const response = await request(app.getHttpServer())
        .get('/entry')
        .expect(HttpStatus.OK);
  
      // Check individual response fields
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Entries retrieved successfully');
      expect(response.body.data).toEqual(mockEntries);
    });
});
