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

  it('should return an error if there is a database failure', async () => {
    // Simulate a database failure (mock the repository)
    jest.spyOn(categoryRepository, 'find').mockRejectedValueOnce(new Error('Database failure'));
    try {
      await request(app.getHttpServer())
        .get('/category') 
        .expect(HttpStatus.INTERNAL_SERVER_ERROR);
    } catch (error) {
      const response = error.response;  // Get the response body from the error

      // Check individual response fields
      expect(response.success).toBe(false);
      expect(response.message).toBe('Error in retrieving categories, database failure');
      expect(response.error).toBeInstanceOf(Error); 
      expect(response.error.message).toBe('Database failure');  
    }
  });

  afterAll(async () => {
    await categoryRepository.manager.connection.destroy();
    await app.close();
  });
});



