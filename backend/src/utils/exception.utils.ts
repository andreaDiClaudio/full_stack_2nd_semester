import { HttpException, HttpStatus } from "@nestjs/common";

export class CategoryNotFoundException extends HttpException {
    constructor(id: number) {
        super(
            {
                //Success of the operation, so in this case the operation is ssuccessful but the data is not
                success: true,
                message: `Category with ID ${id} not found`,
                error: 'Not Found',
            },
            HttpStatus.NOT_FOUND,
        );
    }
}