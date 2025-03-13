import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEntryDto } from './dto/create-entry.dto';
import { UpdateEntryDto } from './dto/update-entry.dto';
import { Entry } from './entities/entry.entity';
import { Category } from 'src/category/entity/category.entity';
import { ResponseDto } from 'src/interfaces/response.interface';

@Injectable()
export class EntryService {

  constructor(
    @InjectRepository(Entry) private entryRepository: Repository<Entry>,
    @InjectRepository(Category) private categoryRepository: Repository<Category>,
  ) {}

  async findAll(): Promise<ResponseDto> {
    try {
      const entries = await this.entryRepository.find({ relations: ['category'] });

      return {
        success: true,
        statusCode: HttpStatus.OK,
        message: entries.length ? 'Entries retrieved successfully' : 'No entries found',
        data: entries
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Error retrieving entries',
          error: 'Internal Server Error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findById(id: number): Promise<ResponseDto> {
    const entry = await this.entryRepository.findOne({ where: { id }, relations: ['category'] });

    if (!entry) {
      throw new HttpException(
        {
          success: false,
          statusCode: HttpStatus.NOT_FOUND,
          message: `Entry with ID ${id} not found`,
          error: 'Not Found',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Entry with ID ${id} found`,
      data: entry
    };
  }

  async create(createEntryDto: CreateEntryDto): Promise<ResponseDto> {
    // Retrieve the Category based on categoryId
    const category = await this.categoryRepository.findOne({ where: { id: createEntryDto.categoryId } });

    if (!category) {
      throw new HttpException(
        {
          success: false,
          statusCode: HttpStatus.NOT_FOUND,
          message: `Category with ID ${createEntryDto.categoryId} not found`,
          error: 'Not Found',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const entry = this.entryRepository.create({
      ...createEntryDto,
      category, // Link the found category to the entry
    });

    await this.entryRepository.save(entry);

    return {
      success: true,
      statusCode: HttpStatus.CREATED,
      message: 'Entry created successfully',
      data: entry,
    };
  }

  async update(id: number, updateEntryDto: UpdateEntryDto): Promise<ResponseDto> {
    const entry = await this.entryRepository.findOne({ where: { id } });

    if (!entry) {
      throw new HttpException(
        {
          success: false,
          statusCode: HttpStatus.NOT_FOUND,
          message: `Entry with ID ${id} not found`,
          error: 'Not Found',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const updatedEntry = await this.entryRepository.save({
      ...entry,
      ...updateEntryDto
    });

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Entry with ID ${id} updated successfully`,
      data: updatedEntry
    };
  }

  async delete(id: number): Promise<ResponseDto> {
    const entry = await this.entryRepository.findOne({ where: { id } });

    if (!entry) {
      throw new HttpException(
        {
          success: false,
          statusCode: HttpStatus.NOT_FOUND,
          message: `Entry with ID ${id} not found`,
          error: 'Not Found',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    await this.entryRepository.delete(id);

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Entry with ID ${id} deleted successfully`
    };
  }
}
