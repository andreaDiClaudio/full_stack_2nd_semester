import { IsOptional, IsNumber, IsString } from 'class-validator';

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
