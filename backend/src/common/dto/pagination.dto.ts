import { IsOptional, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class PaginationDto {
  @ApiPropertyOptional({ default: 1, description: 'Trang số mấy?' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 10, description: 'Số lượng bản ghi mỗi trang' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50) // Giới hạn max 50 để bảo vệ server
  take?: number = 10;

  // Getter tính toán số bản ghi cần bỏ qua
  get skip(): number {
    return ((this.page || 1) - 1) * (this.take || 10);
  }
}