import { Transform, Type, type TransformFnParams } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator';

export class CreateAccountDto {
  @Transform(({ value }: TransformFnParams) => {
    const input = value as unknown;
    return typeof input === 'string' ? input.trim() : input;
  })
  @IsString()
  @MinLength(3)
  @IsNotEmpty()
  name!: string;

  @Type(() => Number)
  @IsNumber()
  @Min(1000000000, { message: 'Account Number Should Not be below  10 digits' }) // Minimum: 1,000,000,000 (10 digits)
  @Max(9999999999, { message: 'Account Number Should Not Pass 10 digits' }) // Maximum: 9,999,999,999 (10 digits)
  @IsNotEmpty()
  accNumber!: number;

  @Transform(({ value }: TransformFnParams) => {
    const input = value as unknown;
    return typeof input === 'string' ? input.trim() : input;
  })
  @IsString()
  @MinLength(3)
  @IsNotEmpty()
  bankName!: string;
}
