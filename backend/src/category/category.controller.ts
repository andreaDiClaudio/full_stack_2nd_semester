import { Controller } from '@nestjs/common';
import { CategoryService } from './category.service';

@Controller('category')
export class CategoryController {

    // Step 6: inject service
    constructor(private readonly categoryService: CategoryService) {}

}
