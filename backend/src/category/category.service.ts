import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entity/category.entity';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { ResponseDto } from 'src/interfaces/response.interface';
import { CategoryNotFoundException } from 'src/utils/exception.utils';

@Injectable()
export class CategoryService {

    // Step 5: inject the cateogry repository and set the category entity in the service. 
    // If we not inject it we need to create manually a new Repository object with the 'new' keyword. It is relevant for Unit Testing.
    // It is possible to mock depenceies injection. The main difference is that with injection is possible to mock and test the functionalities,
    //  while if creating manually a new instance of the repo, it is not possible to mock because we harcoded a connection between serive and repo.
    constructor(@InjectRepository(Category) private categoryRepository: Repository<Category>,) { }

    async findAll() {
        try {
            const categories = await this.categoryRepository.find();

            return {
                success: true,
                statusCode: HttpStatus.OK,
                message: categories.length ? 'Categories retrieved successfully' : 'No categories found',
                data: categories
            }
        } catch (error) {
            throw new HttpException(
                {
                    success: false,
                    message: 'Error in retrieving categories, database failure',
                    error: error || 'Unknown error'
                },
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    };

    // Find category by ID
    async findById(id: number): Promise<ResponseDto> {
        // Start with the try-catch block to handle any unexpected errors
        try {
            // Fetch the category by ID
            const category = await this.categoryRepository.findOne({ where: { id } });

            if (!category) {
                throw new CategoryNotFoundException(id);  // Throw custom exception
            }

            // Return a success response with the category data
            return {
                success: true,
                message: `Category with ID ${id} found`,
                statusCode: HttpStatus.OK,
                data: category
            };

        } catch (error) {
            // Catch custom exceptions or unexpected errors
            if (error instanceof CategoryNotFoundException) {
                // Handle the custom exception
                throw error;
            }

            // Handle unexpected errors
            throw new HttpException(
                {
                    success: false,
                    message: 'Error retrieving category',
                    error: error || 'Unknown error'
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async create(createCategoryDto: CreateCategoryDto): Promise<ResponseDto> {
        try {
            const cateogry = await this.categoryRepository.save(createCategoryDto);

            return {
                success: true,
                statusCode: HttpStatus.CREATED,
                message: 'Category created successfully',
                data: cateogry
            }
        } catch (error) {
            throw new HttpException(
                {
                    success: false,
                    message: 'Error in creating category',
                    error: error || 'Unknown error'
                },
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }

    async delete(id: number) {
    }
}
