import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client, ClientProxy, Transport } from '@nestjs/microservices';
import { s3, fetchBuffer } from 'libs';
import { v4 as uuidv4 } from 'uuid';

const logger = new Logger('ImageService');
@Injectable()
export class ImageService implements OnModuleInit {
  @Client({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.rabbitMqURL],
      queue: 'images',
      // make the queue durable so it can survive a restart
      queueOptions: { durable: true },
    },
  })
  client: ClientProxy;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    await this.client.connect();
    logger.log('Connected to RabbitMQ');
  }

  async addImage(url: string): Promise<string | boolean> {
    const imageUrl = await this.addImageToBucket(url);
    if (!imageUrl) return false;
    // Publish image URL to message queue
    this.client.emit('imageAdded', imageUrl);
    return imageUrl;
  }

  private async addImageToBucket(imageUrl: string) {
    try {
      const uuid = uuidv4();
      const bucketName = this.configService.getOrThrow('bucketName');
      const region = this.configService.getOrThrow('REGION');
      await s3
        .putObject({
          Bucket: bucketName,
          Key: `${uuid}.jpg`,
          Body: await fetchBuffer(imageUrl),
        })
        .promise();
      // we return string instead of true because we need to return the image URL
      // one can use !!imageUrl to validate if the image was added to the bucket
      return `https://${bucketName}.s3.${region}.amazonaws.com/${uuid}.jpg`;
    } catch {
      return false;
    }
  }
}
