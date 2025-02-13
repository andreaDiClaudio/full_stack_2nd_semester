import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';

@Controller('category')
export class CategoryController {

    // Step 6: inject service
    constructor(private readonly categoryService: CategoryService) {}

    @Get()
    @HttpCode(HttpStatus.OK)
    findAll() {
        return this.categoryService.findAll();
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(@Body() createCategoryDto: CreateCategoryDto) {
        return this.categoryService.create(createCategoryDto);
    }
}