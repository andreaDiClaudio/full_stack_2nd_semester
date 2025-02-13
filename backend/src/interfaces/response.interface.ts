export interface ResponseDto {
    success: boolean;
    message: string;
    data?: any;
    statusCode: number;
    error?: string;
  }