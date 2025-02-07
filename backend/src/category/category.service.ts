import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entity/category.entity';
import { Repository } from 'typeorm';
import { CreateCateogoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoryService {

    // Step 5: inject the cateogry repository and set the category entity in the service. 
    // If we not inject it we need to create manually a new Repository object with the 'new' keyword. It is relevant for Unit Testing.
    // It is possible to mock depenceies injection. The main difference is that with injection is possible to mock and test the functionalities,
    //  while if creating manually a new instance of the repo, it is not possible to mock because we harcoded a connection between serive and repo.
    constructor(@InjectRepository(Category) private categoryRepository: Repository<Category>, ) { }

    findAll() {
        return this.categoryRepository.find({});
    };
    
    findById(id: number) {
        return `This action returns a #${id} category`;
    };

    create(createCategoryDto: CreateCateogoryDto) {
        return this.categoryRepository.save(createCategoryDto);
    }

    update(id: number) { //Import also the updateDto
        return `This action updates a #${id} category`;
    }

    delete(id: number) { //Import also the deleteDto
        return `This action removes a #${id} category`;
    }
}
