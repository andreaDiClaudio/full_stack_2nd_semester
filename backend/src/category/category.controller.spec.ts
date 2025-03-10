import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';  // Importing supertest
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpStatus } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entity/category.entity';
import { Entry } from 'src/entry/entities/entry.entity';

// Mock data for the tests
const mockCategories = [
  { title: 'Category 1' },
  { title: 'Category 2' },
];

const newCategory = {
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
          entities: [Category, Entry],
          synchronize: true, // Automatically synchronize database schema
        }),
        TypeOrmModule.forFeature([Category, Entry]),
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

    it('should return a single category', async () => {
      await categoryRepository.save(mockCategories);
      const id = 1;

      // Assuming you have already saved a category with ID 1 in the database
      const response = await request(app.getHttpServer())
        .get(`/category/${id}`)
        .expect(HttpStatus.OK);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe(`Category with ID ${id} found`);
    });

    it('should return 404 if category is not found', async () => {
      const id = 999; // Assuming this ID does not exist

      const response = await request(app.getHttpServer())
        .get(`/category/${id}`)
        .expect(HttpStatus.NOT_FOUND);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe(`Category with ID ${id} not found`);
      expect(response.body.error).toBe('Not Found');
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
      expect(response.body.data).toEqual({
        description: "",
        title: "New Category",
        id: 3
      });
    });

    it('should return 400 if the category data is invalid', async () => {
      // First request: Missing both id and title
      const invalidCategoryDto = {};

      const response1 = await request(app.getHttpServer())
        .post('/category')
        .send(invalidCategoryDto)
        .expect(HttpStatus.BAD_REQUEST);

      expect(response1.body).toBeDefined();
      expect(response1.body.error).toBe('Bad Request');
      expect(response1.body.message).toContain('title must be a string');
      expect(response1.body.message).toContain('title should not be empty');
    });
  });

  describe('Put', () => {
    it('should update the category if found', async () => {
      // Save initial mock categories
      await categoryRepository.save(mockCategories);
      const id = 1;
  
      const updatedCategory = {
        title: 'Updated Category',
      };
  
      const response = await request(app.getHttpServer())
        .put(`/category/${id}`)
        .send(updatedCategory)
        .expect(HttpStatus.OK);
  
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe(`Category with ID ${id} updated successfully`);
      expect(response.body.data.title).toBe(updatedCategory.title);
    });
  
    it('should return 404 if category to update is not found', async () => {
      const id = 999; // Assuming this ID does not exist
  
      const updatedCategory = {
        title: 'Updated Category',
      };
  
      const response = await request(app.getHttpServer())
        .put(`/category/${id}`)
        .send(updatedCategory)
        .expect(HttpStatus.NOT_FOUND);
  
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe(`Category with ID ${id} not found`);
      expect(response.body.error).toBe('Not Found');
    });
  
    it('should return 400 if the update data is invalid', async () => {
      await categoryRepository.save(mockCategories);
      const id = 1;
  
      // Invalid data (missing title)
      const invalidUpdate = {};
  
      const response = await request(app.getHttpServer())
        .put(`/category/${id}`)
        .send(invalidUpdate)
        .expect(HttpStatus.BAD_REQUEST);
  
      expect(response.body.error).toBe('Bad Request');
      expect(response.body.message).toContain('title should not be empty');
    });
  
    it('should return 400 if category title is empty', async () => {
      await categoryRepository.save(mockCategories);
      const id = 1;
  
      // Invalid data (empty title)
      const invalidUpdate = {
        title: '',
      };
  
      const response = await request(app.getHttpServer())
        .put(`/category/${id}`)
        .send(invalidUpdate)
        .expect(HttpStatus.BAD_REQUEST);
  
      expect(response.body.error).toBe('Bad Request');
      expect(response.body.message).toContain('title should not be empty');
    });
  });

  describe('Delete', () => {
    it('should delete the category if found', async () => {
      await categoryRepository.save(mockCategories);
      const id = 1;

      const response = await request(app.getHttpServer())
        .delete(`/category/${id}`)
        .send({ id })
        .expect(HttpStatus.OK);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain(`Category with ID ${id} deleted successfully`);
    });

  });
  afterAll(async () => {
    await categoryRepository.manager.connection.destroy();
    await app.close();
  });
});



