import { Transform } from 'class-transformer';
import { IsEmail, MinLength } from 'class-validator';

export class signupDto {
  @MinLength(3)
  name!: string;

  @Transform(({ value }) => {
    const input: unknown = value;
    return typeof input === 'string' ? input.toLowerCase().trim() : input;
  })
  @IsEmail()
  email!: string;

  @MinLength(6)
  password!: string;
}
