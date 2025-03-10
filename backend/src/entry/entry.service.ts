import { Injectable } from '@nestjs/common';
import { Entry } from './entity/entry.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEntryDto } from './dto/create-entity.dto';
import { UpdateEntryDto } from './dto/update-entry.dto';

@Injectable()
export class EntryService {
    constructor(@InjectRepository(Entry) private entriesRepository: Repository<Entry>) {}
  
  create(createEntryDto: CreateEntryDto) {
    return this.entriesRepository.save(createEntryDto);
  }

  findAll() {
    return this.entriesRepository.find({});
  }

  findOne(id: number) {
    return `This action returns a #${id} entry`;
  }

  update(id: number, updateEntryDto: UpdateEntryDto) {
    return `This action updates a #${id} entry`;
  }

  remove(id: number) {
    return `This action removes a #${id} entry`;
  }
}
