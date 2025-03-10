import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateEntryDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsNumber()
    amount: number;

    @IsNotEmpty()
    categoryId: number;
}
