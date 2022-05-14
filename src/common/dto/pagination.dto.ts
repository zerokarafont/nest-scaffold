import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class PaginatedResponseDto<T> {
  data: T[];
}

export class PaginationQueryDto {
  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({ default: 1 })
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({ default: 10 })
  pageSize?: number = 10;
}
