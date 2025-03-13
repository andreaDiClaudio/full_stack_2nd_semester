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
  let categoryRepository: Repository<Category>;

  const mockCategories = [
    { id: 1, title: 'Category 1' },
    { id: 2, title: 'Category 2' },
  ];

  const mockEntries = [
    { id: 1, title: 'Entry 1', amount: 10, category: mockCategories[0] },
    { id: 2, title: 'Entry 2', amount: 20, category: mockCategories[1] },
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
    categoryRepository = module.get<Repository<Category>>(getRepositoryToken(Category));
  });

  afterEach(async () => {
    // Clean up any data from the database after each test run
    await entryRepository.clear();
    await categoryRepository.clear();
  });

  describe('GET /entry', () => {
    it('should return a list of entries', async () => {
      await categoryRepository.save(mockCategories);
      await entryRepository.save(mockEntries);

      const response = await request(app.getHttpServer())
        .get('/entry')
        .expect(HttpStatus.OK);

      expect(response.body).toEqual({
        success: true,
        message: 'Entries retrieved successfully',
        data: mockEntries,
        statusCode: 200,
      });
    });
  });

  describe('GET /entry/:id', () => {
    it('should return an entry by id', async () => {
      await categoryRepository.save(mockCategories);
      await entryRepository.save(mockEntries);

      const response = await request(app.getHttpServer())
        .get('/entry/1')
        .expect(HttpStatus.OK);

      expect(response.body).toEqual({
        success: true,
        message: 'Entry with ID 1 found',
        data: mockEntries[0],
        statusCode: 200,
      });
    });

    it('should return 404 if entry not found', async () => {
      const response = await request(app.getHttpServer())
        .get('/entry/999')
        .expect(HttpStatus.NOT_FOUND);

      expect(response.body.message).toBe('Entry with ID 999 not found');
      expect(response.body.statusCode).toBe(404);
    });
  });

  describe('POST /entry', () => {
    it('should create a new entry', async () => {
      await categoryRepository.save(mockCategories);

      const createEntryDto = {
        title: 'New Entry',
        amount: 30,
        categoryId: mockCategories[0].id,
      };

      const response = await request(app.getHttpServer())
        .post('/entry')
        .send(createEntryDto)
        .expect(HttpStatus.CREATED);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Entry created successfully');
      expect(response.body.data.title).toBe(createEntryDto.title);
    });
  });

  describe('PUT /entry/:id', () => {
    it('should update an entry', async () => {
      await categoryRepository.save(mockCategories);
      const [entry] = await entryRepository.save(mockEntries);

      const updateEntryDto = {
        title: 'Updated Entry',
        amount: 50,
        categoryId: mockCategories[1].id,
      };

      const response = await request(app.getHttpServer())
        .put(`/entry/${entry.id}`)
        .send(updateEntryDto)
        .expect(HttpStatus.OK);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe(`Entry with ID ${entry.id} updated successfully`);
      expect(response.body.data.title).toBe(updateEntryDto.title);
    });

    it('should return 404 if entry to update not found', async () => {
      const updateEntryDto = {
        title: 'Non-existent Entry',
        amount: 100,
        categoryId: 999, // invalid category
      };

      const response = await request(app.getHttpServer())
        .put('/entry/999')
        .send(updateEntryDto)
        .expect(HttpStatus.NOT_FOUND);

      expect(response.body.message).toBe('Entry with ID 999 not found');
      expect(response.body.statusCode).toBe(404);
    });
  });

  describe('DELETE /entry/:id', () => {
    it('should delete an entry', async () => {
      await categoryRepository.save(mockCategories);
      const [entry] = await entryRepository.save(mockEntries);

      const response = await request(app.getHttpServer())
        .delete(`/entry/${entry.id}`)
        .expect(HttpStatus.OK);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe(`Entry with ID ${entry.id} deleted successfully`);
    });

    it('should return 404 if entry to delete not found', async () => {
      const response = await request(app.getHttpServer())
        .delete('/entry/999')
        .expect(HttpStatus.NOT_FOUND);

      expect(response.body.message).toBe('Entry with ID 999 not found');
      expect(response.body.statusCode).toBe(404);
    });
  });
});
