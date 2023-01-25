import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UrlDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  url!: string;
}
