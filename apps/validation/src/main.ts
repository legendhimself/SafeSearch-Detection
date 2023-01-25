import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationModule } from './validation.module';
import { Logger } from '@nestjs/common';

const logger = new Logger();
async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    ValidationModule,
    {
      transport: Transport.RMQ,
      logger: ['error', 'warn', 'log'],
      options: {
        queue: 'images',
        // make the queue durable so it can survive a restart
        queueOptions: {
          durable: true,
        },
        urls: [process.env.rabbitMqURL],
      },
    },
  );

  await app.listen().catch((e) => console.error(e));
  logger.log('Microservice is listening');
}
bootstrap();
