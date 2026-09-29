import { Transform } from 'class-transformer';
import { IsEmail, MinLength } from 'class-validator';

export class CreateAuthDto {
  @MinLength(3)
  userName!: string;

  @Transform(({ value }) => {
    const input: unknown = value;
    return typeof input === 'string' ? input.toLowerCase().trim() : input;
  })
  @IsEmail()
  email!: string;

  @MinLength(6)
  password!: string;
}
