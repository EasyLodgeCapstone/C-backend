import { Transform, Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
  Min,
  MinLength,
  IsBoolean,
  IsArray,
  IsNotEmpty,
} from 'class-validator';

export class CreateProductDto {
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

  //  1. Thumbnail image URL (required)
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  thumbnailImage!: string;

  //  2. Gallery image URLs (array, optional)
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  //  3. Video URL (optional)
  @IsString()
  @IsOptional()
  videoUrl?: string;
}
