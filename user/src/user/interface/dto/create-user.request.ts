/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserRequest {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @MinLength(5)
  readonly name: string;

  @IsNotEmpty()
  @IsEmail()
  @MinLength(5)
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(30)
  readonly password: string;
}
