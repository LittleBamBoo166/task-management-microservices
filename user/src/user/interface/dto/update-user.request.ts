/* eslint-disable @typescript-eslint/no-unused-vars */
import { IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateUserRequest {
  @IsString()
  @MaxLength(100)
  @MinLength(5)
  readonly name?: string;

  @IsString()
  @MinLength(8)
  @MaxLength(30)
  readonly password?: string;
}
