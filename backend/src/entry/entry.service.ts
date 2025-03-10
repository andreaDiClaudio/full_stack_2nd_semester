import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEntryDto } from './dto/create-entry.dto';
import { UpdateEntryDto } from './dto/update-entry.dto';
import { CategoryNotFoundException } from 'src/utils/exception.utils';
import { ResponseDto } from 'src/interfaces/response.interface';
import { Entry } from './entities/entry.entity';
import { Category } from 'src/category/entity/category.entity';

@Injectable()
export class EntryService {

  constructor(@InjectRepository(Entry) private entryRepository: Repository<Entry>, @InjectRepository(Category) private categoryRepository: Repository<Category>) { }

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
          message: 'Error retrieving entries',
          error: 'Internal Server Error'
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findById(id: number): Promise<ResponseDto> {
    try {
      const entry = await this.entryRepository.findOne({ where: { id }, relations: ['category'] });

      if (!entry) {
        // If entry not found, throw your custom error with a simpler message
        throw new HttpException(
          {
            success: false,
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
    } catch (error) {
      // Simplify the error structure when caught
      if (error instanceof HttpException) {
        throw error; // If it's an HTTP exception, just rethrow it
      }

      // Handle unexpected errors
      throw new HttpException(
        {
          success: false,
          message: 'Error retrieving entry',
          error: 'Internal Server Error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async create(createEntryDto: CreateEntryDto): Promise<ResponseDto> {
    try {
      // Step 1: Retrieve the Category based on categoryId
      const category = await this.categoryRepository.findOne({ where: { id: createEntryDto.categoryId } });

      // Step 2: Handle the case where the Category is not found
      if (!category) {
        throw new HttpException(
          {
            success: false,
            message: `Category with ID ${createEntryDto.categoryId} not found`,
            error: 'Not Found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      // Step 3: Create the Entry and link the Category to it
      const entry = this.entryRepository.create({
        ...createEntryDto, // This includes title and amount
        category, // Link the found category to the entry
      });

      // Step 4: Save the entry to the database
      await this.entryRepository.save(entry);

      return {
        success: true,
        statusCode: HttpStatus.CREATED,
        message: 'Entry created successfully',
        data: entry,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Error creating entry',
          error: 'Internal Server Error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: number, updateEntryDto: UpdateEntryDto): Promise<ResponseDto> {
    try {
      const entry = await this.entryRepository.findOne({ where: { id } });

      if (!entry) {
        throw new HttpException(
          {
            success: false,
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
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Error updating entry',
          error: 'Internal Server Error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async delete(id: number): Promise<ResponseDto> {
    try {
      const entry = await this.entryRepository.findOne({ where: { id } });

      if (!entry) {
        throw new HttpException(
          {
            success: false,
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
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Error deleting entry',
          error: 'Internal Server Error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
