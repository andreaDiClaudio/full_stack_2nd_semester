import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { CategoryService } from './category.service';

@Controller('category')
export class CategoryController {

    //TODO: finish exercise
    // Step 6: inject service
    constructor(private readonly categoryService: CategoryService) {}

    @Get()
    @HttpCode(HttpStatus.OK)
    findAll() {
        return this.categoryService.findAll();
    }
}