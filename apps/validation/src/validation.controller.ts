import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { ImageValidationService } from './validation.service';

@Controller()
export class ValidationController {
  constructor(private readonly imageService: ImageValidationService) {}
  @EventPattern('imageAdded')
  async imageAdded(imageUrl: string) {
    const validate = await this.imageService.validateImage(imageUrl, 'aws');
    console.log(validate);
  }
}
