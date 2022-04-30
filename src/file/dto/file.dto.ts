import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { UploadType } from '../interfaces/file-type';

export class FileUploadDto {
  @IsNotEmpty()
  @ApiProperty({ type: 'string', format: 'binary', required: true })
  file: any;
}

export class FilesUploadDto {
  @IsNotEmpty()
  @ApiProperty({
    type: 'array',
    items: { type: 'string', format: 'binary' },
    required: true,
  })
  files: any[];
}

export class FileQueryDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @ApiPropertyOptional()
  id?: number;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  filename?: string;

  @IsOptional()
  @IsEnum(UploadType)
  @ApiPropertyOptional({ enum: UploadType })
  type?: UploadType;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @ApiPropertyOptional({ default: 1 })
  current?: number = 1;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @ApiPropertyOptional({ default: 10 })
  pageSize?: number = 10;
}
