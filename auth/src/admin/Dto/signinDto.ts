import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class signinDto {
  @IsNotEmpty({ message: 'Email or name is required' })
  @MinLength(3)
  userCre!: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  password!: string;
}
