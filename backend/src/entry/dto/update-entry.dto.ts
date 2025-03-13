import { IsOptional, IsNumber, IsString } from 'class-validator';

//TODO convert because they are not optional
export class UpdateEntryDto {
    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsNumber()
    amount?: number;

    @IsOptional()
    categoryId?: number;
}
