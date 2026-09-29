import { CreateProductDto } from './create-product.dto';
import {
  IsBoolean,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @IsString()
  @MinLength(3)
  productName!: string;

  @IsString()
  @MinLength(3)
  productDescription!: string;

  @Type(() => Number)
  @Min(0)
  productPrice!: number;

  @IsOptional()
  @Type(() => Number)
  @Min(0)
  discountPrice!: number;

  @IsString()
  @MinLength(3)
  category!: string;

  @IsString()
  @MinLength(1)
  subCategory!: string;

  @IsString()
  @MinLength(3)
  productFeatures!: string;

  @IsString()
  @IsOptional()
  texture?: string;

  @IsString()
  @IsOptional()
  scent?: string;

  @IsString()
  @IsOptional()
  color?: string;

  @IsString()
  @IsOptional()
  packaging?: string;

  @Type(() => Number)
  @Min(0)
  stockQuantity!: number;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }: { value: unknown }): unknown => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    return value;
  })
  isInStock?: boolean = true;

  // @ValidateNested()
  // @Type(() => ProductFeatureDto)
  // @IsOptional()
  // featureDetails?: ProductFeatureDto;
}
