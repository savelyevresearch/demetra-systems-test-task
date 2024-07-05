import { IsNotEmpty, IsEmail, IsString, MinLength } from "class-validator";

/**
 * @description DTO for user object
 * @class
 */
export class UserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;
}
