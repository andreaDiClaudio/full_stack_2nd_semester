import { HttpException, HttpStatus } from "@nestjs/common";

export class CategoryNotFoundException extends HttpException {
    constructor(id: number) {
        super(
            {
                success: true,
                message: `Category with ID ${id} not found`,
                error: 'Not Found',
            },
            HttpStatus.NOT_FOUND,
        );
    }
}