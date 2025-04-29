import { Controller, Post, Body, Get } from '@nestjs/common';
import { ImageService } from './image.service';

@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post('upload')
  async uploadImage(@Body() body: { image: string }) {
    return this.imageService.uploadToFreeImageHost(body.image);
  }
}