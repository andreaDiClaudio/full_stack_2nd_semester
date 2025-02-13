import { Test, TestingModule } from '@nestjs/testing';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entity/category.entity';

// Mock data for the tests
const mockCategories = [
  { id: 1, title: 'Category 1' },
  { id: 2, title: 'Category 2' },
];

describe('CategoryController', () => {
  let controller: CategoryController;
  let service: CategoryService;
  let categoryRepository: Repository<Category>;

  beforeEach(async () => {
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

    controller = module.get<CategoryController>(CategoryController);
    service = module.get<CategoryService>(CategoryService);
    categoryRepository = module.get<Repository<Category>>(getRepositoryToken(Category));
  });

  afterEach(async () => {
    // Clean up any data from the database after each test run
    await categoryRepository.clear();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe("Get", () => {
    it('hould return all categories with success message and status 200', async () => {
      await categoryRepository.save(mockCategories);

      const result = await controller.findAll();
      expect(result.success).toBe(true);
      expect(result.message).toBe('Categories retrieved successfully');
      expect(result.data).toEqual(mockCategories);
    });
  });

  it('should return "No categories found" when there are no categories', async () => {
    const result = await controller.findAll();
    expect(result.success).toBe(true);
    expect(result.message).toBe('No categories found');
    expect(result.data).toEqual([]);
  });

  it('should throw an error if there is a database failure', async () => {
    jest.spyOn(categoryRepository, 'find').mockRejectedValueOnce(new Error('Database failure'));

    try {
      await controller.findAll();
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.getStatus()).toBe(HttpStatus.INTERNAL_SERVER_ERROR);

      const response = error.getResponse();
      expect(response.success).toBe(false);
      expect(response.message).toBe('Error in retrieving categories, database failure');
      expect(response.error).toBeInstanceOf(Error); // Ensure it's an Error object
      expect(response.error.message).toBe('Database failure');
    }
  });

  afterAll(async () => {
    // Close the database connection after all tests are completed
    await categoryRepository.manager.connection.destroy();
  });
});
