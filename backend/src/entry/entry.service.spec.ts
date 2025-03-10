import { Test, TestingModule } from '@nestjs/testing';
import { EntryService } from './entry.service';
import { Entry } from './entities/entry.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('EntryService', () => {
  let service: EntryService;
  let repository: jest.Mocked<Partial<Repository<Entry>>>;

  //TODO FIX ERROR AND Create test for controller
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
          providers: [
            EntryService,
            {
              provide: getRepositoryToken(Entry),
              useValue: repository,
            }
          ],
        }).compile();
    
        service = module.get<EntryService>(EntryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
