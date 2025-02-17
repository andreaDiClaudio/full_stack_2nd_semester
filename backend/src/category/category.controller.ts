import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Req, UsePipes, ValidationPipe } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('category')
export class CategoryController {

    // Step 6: inject service
    constructor(private readonly categoryService: CategoryService) { }

    @Get()
    @HttpCode(HttpStatus.OK)
    findAll() {
        return this.categoryService.findAll();
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    findById(@Param('id') id: number) {
        return this.categoryService.findById(id);
    }

    @Post()
    @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }))
    @HttpCode(HttpStatus.CREATED)
    create(@Body() createCategoryDto: CreateCategoryDto) {
        return this.categoryService.create(createCategoryDto);
    }

    @Put(':id')
    @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }))
    @HttpCode(HttpStatus.OK)
    async update(
        @Param('id') id: number,
        @Body() updateCategoryDto: UpdateCategoryDto,  // Use UpdateCategoryDto here
    ) {
        return this.categoryService.update(id, updateCategoryDto);  // Call service method to update
    }

    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    async remove(
        @Param('id') id: number,
        @Req() req: Request,
    ) {
        return this.categoryService.delete(id);
    }

}