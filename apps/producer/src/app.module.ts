import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SwaggerModule } from '@nestjs/swagger';
import { AppController } from './app.controller';
import { ImageService } from './detection/image.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    SwaggerModule,
  ],
  controllers: [AppController],
  providers: [ImageService, ConfigService],
})
export class AppModule {}
