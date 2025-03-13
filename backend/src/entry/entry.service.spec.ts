import { Test, TestingModule } from '@nestjs/testing';
import { EntryService } from './entry.service';
import { Entry } from './entities/entry.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Category } from 'src/category/entity/category.entity';

describe('EntryService', () => {
  let service: EntryService;
  let entryRepository: jest.Mocked<Partial<Repository<Entry>>>;
  let categoryRepository: jest.Mocked<Partial<Repository<any>>>; // Mock CategoryRepository as well

  beforeEach(async () => {
    // Mock the repositories
    entryRepository = { findOne: jest.fn() } as any;
    categoryRepository = { findOne: jest.fn() } as any; // Mock CategoryRepository here

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EntryService,
        {
          provide: getRepositoryToken(Entry),
          useValue: entryRepository,
        },
        {
          provide: getRepositoryToken(Category), // Provide mock for CategoryRepository
          useValue: categoryRepository,
        },
      ],
    }).compile();

    service = module.get<EntryService>(EntryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
