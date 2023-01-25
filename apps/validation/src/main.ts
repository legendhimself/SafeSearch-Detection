import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { ValidationModule } from './validation.module';
import { Logger } from '@nestjs/common';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

const logger = new Logger();
async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    ValidationModule,
    new FastifyAdapter(),
  );

  app.connectMicroservice({
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
  });

  // app.connectMicroservice({
  //   transport: Transport.RMQ,
  //   logger: ['error', 'warn', 'log'],
  //   options: {
  //     queue: 'test-images',
  //     // make the queue durable so it can survive a restart
  //     queueOptions: {
  //       durable: false,
  //     },
  //     urls: [process.env.rabbitMqURL],
  //   },
  // });

  await app.startAllMicroservices().catch((e) => console.error(e));
  logger.log('Microservice is listening');
}
bootstrap();
