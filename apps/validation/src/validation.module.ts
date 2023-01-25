import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from 'aws-sdk';
import { ValidationController } from './validation.controller';
import { ImageValidationService } from './validation.service';

@Module({
  controllers: [ValidationController],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
  providers: [ImageValidationService, ConfigService],
})
export class ValidationModule {}
