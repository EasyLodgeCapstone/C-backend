import { Type } from 'class-transformer';
import { IsString } from 'class-validator';

export class CartDto {
  @IsString()
  productId!: string;

  @Type(() => Number)
  quantity!: number;
}
