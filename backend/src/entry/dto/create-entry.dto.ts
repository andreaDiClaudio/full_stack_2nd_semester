import { Category } from "src/category/entity/category.entity"

export class CreateEntryDto {
    title: string

    amount: number

    category: Category
}