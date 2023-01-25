import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { s3 } from '@libs';

@Injectable()
export class ImageValidationService {
  constructor(private readonly configService: ConfigService) {}

  async validateImage(
    imageUrl: string,
    validateWith: 'aws' | 'google' | 'free' = 'free',
  ) {
    const { validateImage } = (
      validateWith == 'google'
        ? await import(`./DetectionModules/google`)
        : validateWith === 'aws'
        ? await import('./DetectionModules/aws')
        : // @todo: change this to free when free is ready
          await import('./DetectionModules/aws')
    ) as {
      validateImage: (imageUrl: string) => Promise<{
        unsafe: boolean;
        key: string;
      }>;
    };
    const { unsafe, key } = await validateImage(imageUrl);
    if (unsafe) return { deleted: await this.deleteImageFromBucket(key) };
    return { deleted: false };
  }

  private async deleteImageFromBucket(key: string) {
    try {
      await s3
        .deleteObject({
          Bucket: this.configService.getOrThrow('bucketName'),
          Key: key,
        })
        .promise();
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }
}
