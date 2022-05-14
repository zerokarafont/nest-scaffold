import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SignatureDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  message: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  signature: string;
}
