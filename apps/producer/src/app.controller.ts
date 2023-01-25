import { Body, Controller, HttpCode, Put } from '@nestjs/common';
import { ImageService } from './detection/image.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { UrlDto } from 'libs';

@ApiTags('Image')
@Controller('image')
export class AppController {
  constructor(private readonly imageService: ImageService) {}

  @ApiResponse({
    status: 200,
    description: 'upload an image to the bucket.',
  })
  @HttpCode(200)
  @Put('upload')
  async putImage(@Body() { url }: UrlDto): Promise<{
    success: boolean;
    respUrl?: string | boolean;
  }> {
    const respUrl = await this.imageService.addImage(url);
    return { success: !!respUrl, ...(respUrl && { respUrl }) };
  }

  @ApiResponse({
    status: 200,
    description: 'test.',
  })
  @HttpCode(200)
  @Put('test')
  async test(@Body() { url }: UrlDto) {
    this.imageService.testImageDetection(url);
    return { success: true };
  }
}
