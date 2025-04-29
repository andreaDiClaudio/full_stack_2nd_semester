import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import * as FormData from 'form-data';

@Injectable()
export class ImageService {
  constructor(private readonly httpService: HttpService) {}


  async uploadToFreeImageHost(base64Image: string) {
    const formData = new FormData();
    formData.append('image', base64Image);

    const apiKey = process.env.IMG_API_KEY;
    const uploadUrl = `https://freeimage.host/api/1/upload?key=${apiKey}`;

    const headers = formData.getHeaders();

    const { data } = await firstValueFrom(
      this.httpService.post(uploadUrl, formData, { headers })
    );

    return {
      success: true,
      imageUrl: data.image?.url, // or adapt based on API response
    };

    
  }
}