import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
  Matches,
} from 'class-validator';

export class CreateCartDto {
  @IsString()
  productId!: string;

  @IsNumber()
  productQuantity!: number;

  @IsString()
  @MinLength(3)
  productName!: string;

  @IsString()
  @MinLength(3)
  productDescription!: string;

  @IsNumber()
  @Min(0)
  productPrice!: number;

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

  // Accept base64 strings from frontend
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @Matches(/^data:image\/(png|jpeg|jpg|gif|webp);base64,/, {
    each: true,
    message: 'Each image must be a valid base64 image',
  })
  images?: string[];

  @IsString()
  @IsOptional()
  @Matches(/^data:image\/(png|jpeg|jpg|gif|webp);base64,/, {
    message: 'Thumbnail must be a valid base64 image',
  })
  thumbnailImage?: string;

  @IsString()
  @IsOptional()
  @Matches(/^data:image\/(png|jpeg|jpg|gif|webp);base64,/, {
    message: 'Video URL must be a valid URL',
  })
  videoUrl?: string;
}
