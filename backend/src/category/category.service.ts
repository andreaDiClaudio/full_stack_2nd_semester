import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entity/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryService {

    // Step 5: inject the cateogry repository and set the category entity in the service. 
    // If we not inject it we need to create manually a new Repository object with the 'new' keyword. It is relevant for Unit Testing.
    // It is possible to mock depenceies injection. The main difference is that with injection is possible to mock and test the functionalities,
    //  while if creating manually a new instance of the repo, it is not possible to mock because we harcoded a connection between serive and repo.
    constructor(@InjectRepository(Category) private categryRepository: Repository<Category>){}

    findAll() {

    };

    findById() {

    }

    findByColumn(column:string) {

    }

    createCategory(title: string) {

    }

    editCateogory(id: number) {

    }

    DeleteCategoryDto(id: number) {

    }

}
