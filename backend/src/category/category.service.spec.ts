import { Test, TestingModule } from '@nestjs/testing';
import { CategoryService } from './category.service';
import { Repository } from 'typeorm';
import { Category } from './entity/category.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { ResponseDto } from 'src/interfaces/response.interface';

describe('CategoryService', () => {
  let service: CategoryService;
  let repository: jest.Mocked<Partial<Repository<Category>>>;

  beforeEach(async () => {

    repository = {
      find: jest.fn().mockResolvedValue([
        {
          id: 1,
          title: "Food"
        },
        {
          id: 2,
          title: "Clothing"
        },
      ])
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        {
          provide: getRepositoryToken(Category),
          useValue: repository,
        }
      ],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
  });

  // Wrap function into a describe to group them easier (for exampme by funciton)
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe("Get", () => {
    it("Should return all categories with success message and status 200", async () => {
      const result = await service.findAll();

      expect(result.success).toBe(true);
      expect(result.message).toBe('Categories retrieved successfully');
      expect(result.statusCode).toBe(200);

      expect(repository.find).toHaveBeenCalledTimes(1);
    });

    it("Should return an empty array with success message and status 200", async () => {
      repository.find!.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result.success).toBe(true);
      expect(result.message).toBe('No categories found');
      expect(result.statusCode).toBe(200);
    });

    it('Should throw an error with appropriate message and status 500 on DB failure', async () => {
      repository.find!.mockRejectedValue(new Error('Database connection failed'));

      await expect(service.findAll()).rejects.toThrowError(
        new HttpException(
          {
            success: false,
            message: 'Error in retrieving categories, database failure',
            error: 'Database connection failed'
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    });
  });

  describe("Post", () => {
    it("Should create a category succesfully with valid data", async () => {
      //TODO find a way to mock this properly. See how you did it in the previous project
    })
  })

});
