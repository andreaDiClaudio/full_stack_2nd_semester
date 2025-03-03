import { IsNotEmpty, IsNumber, IsString } from "class-validator"
import { Category } from "src/category/entity/category.entity"


export class CreateEntryDto {
    @IsNotEmpty()
    @IsString()
    title: string

    @IsNumber()
    amount: number

    @IsNotEmpty()
    category: Category
}