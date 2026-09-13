import { PartialType } from '@nestjs/mapped-types';
import { CreateCartDto } from './create-cart.dto';
import { IsNumber } from 'class-validator';

export class UpdateCartDto extends PartialType(CreateCartDto) {
  @IsNumber()
  productQuantity!: number;
}
