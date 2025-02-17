import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateCategoryDto {
    
    @IsString()
    @IsNotEmpty()
    title: string;
}