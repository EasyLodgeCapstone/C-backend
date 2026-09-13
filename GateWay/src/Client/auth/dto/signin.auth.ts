import { Transform } from 'class-transformer';
import { IsEmail, MinLength } from 'class-validator';

export class SigninAuthDto {
  @Transform(({ value }) => {
    const input: unknown = value;
    return typeof input === 'string' ? input.toLowerCase().trim() : input;
  })
  @IsEmail()
  userCre!: string;

  @MinLength(6)
  password!: string;
}
