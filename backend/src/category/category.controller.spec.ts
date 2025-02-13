import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';  // Importing supertest
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpStatus } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entity/category.entity';

// Mock data for the tests
const mockCategories = [
  { id: 1, title: 'Category 1' },
  { id: 2, title: 'Category 2' },
];

const newCategory = {
  id: 100,
  title: 'New Category',
};

describe('CategoryController', () => {
  let app;
  let categoryRepository: Repository<Category>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:', // Use SQLite in-memory database
          entities: [Category],
          synchronize: true, // Automatically synchronize database schema
        }),
        TypeOrmModule.forFeature([Category]),
      ],
      controllers: [CategoryController],
      providers: [CategoryService],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    categoryRepository = module.get<Repository<Category>>(getRepositoryToken(Category));
  });

  afterEach(async () => {
    // Clean up any data from the database after each test run
    await categoryRepository.clear();
  });

  describe('Get', () => {
    it('should return a list of categories', async () => {
      await categoryRepository.save(mockCategories);

      const response = await request(app.getHttpServer())
        .get('/category')
        .expect(HttpStatus.OK);

      // Check individual response fields
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Categories retrieved successfully');
      expect(response.body.data).toEqual(mockCategories);
    });

    it('should return "No categories found" when there are no categories', async () => {
      const response = await request(app.getHttpServer())
        .get('/category')
        .expect(HttpStatus.OK);

      // Check individual response fields
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('No categories found');
      expect(response.body.data).toEqual([]);
    });
  });

  describe('Post', () => {
    it("Should create a new category", async () => {

      const response = await request(app.getHttpServer())
        .post('/category')
        .send(newCategory)
        .expect(HttpStatus.CREATED);

      // Check individual response fields
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Category created successfully');
      expect(response.body.data).toEqual(newCategory);
    });

    it('should return 400 if the category data is invalid (missing id and title for one, missing title for one, missing id for one)', async () => {
      // First request: Missing both id and title
      const invalidCategoryDto1 = {};

      const response1 = await request(app.getHttpServer())
        .post('/category')
        .send(invalidCategoryDto1)
        .expect(HttpStatus.BAD_REQUEST);

      expect(response1.body).toBeDefined();
      expect(response1.body.error).toBe('Bad Request');
      expect(response1.body.message).toContain('id must be a number conforming to the specified constraints');
      expect(response1.body.message).toContain('id should not be empty');
      expect(response1.body.message).toContain('title must be a string');
      expect(response1.body.message).toContain('title should not be empty');

      // Second request: Missing title
      const invalidCategoryDto2 = { id: 1 };

      const response2 = await request(app.getHttpServer())
        .post('/category')
        .send(invalidCategoryDto2)
        .expect(HttpStatus.BAD_REQUEST);

      expect(response2.body).toBeDefined();
      expect(response2.body.error).toBe('Bad Request');
      expect(response2.body.message).toContain('title must be a string');
      expect(response2.body.message).toContain('title should not be empty');

      // Third request: Missing id
      const invalidCategoryDto3 = { title: 'Category 1' };

      const response3 = await request(app.getHttpServer())
        .post('/category')
        .send(invalidCategoryDto3)
        .expect(HttpStatus.BAD_REQUEST);

      expect(response3.body).toBeDefined();
      expect(response3.body.error).toBe('Bad Request');
      expect(response3.body.message).toContain('id must be a number conforming to the specified constraints');
      expect(response3.body.message).toContain('id should not be empty');
    });
  });

  afterAll(async () => {
    await categoryRepository.manager.connection.destroy();
    await app.close();
  });
});



