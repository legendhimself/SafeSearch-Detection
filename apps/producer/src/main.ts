import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

const logger = new Logger();
async function bootstrap() {
  logger.log('Starting Detection API...');
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    {
      rawBody: true,
      cors: {
        origin: '*',
        allowedHeaders: '*',
        methods: '*',
      },
    },
  );
  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('Detection')
    .setDescription('SafeSearch Detection')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  const port = process.env.port;
  await app.listen(port, '0.0.0.0').catch((e) => console.error(e));
  logger.log(`Application is listening on port ${port}`);
}
bootstrap();
