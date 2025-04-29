import { ApiProperty } from '@nestjs/swagger';  // Import Swagger decorators
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateEntryDto {
    @ApiProperty({
        description: 'The title of the entry',
        example: 'Dinner',
    })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({
        description: 'The amount of the entry',
        example: 25.50,
    })
    @IsNumber()
    amount: number;

    @ApiProperty({
        description: 'The ID of the category the entry belongs to',
        example: 1,
    })
    @IsNotEmpty()
    categoryId: number;
}
