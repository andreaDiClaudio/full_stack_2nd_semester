import { Test, TestingModule } from '@nestjs/testing';
import { CategoryService } from './category.service';
import { Repository } from 'typeorm';
import { Category } from './entity/category.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('CategoryService', () => {
  let service: CategoryService;
  let repository: jest.Mocked<Partial<Repository<Category>>>;

  beforeEach(async () => {

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

});
