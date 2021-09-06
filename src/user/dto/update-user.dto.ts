import { IsEmail, IsEmpty, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  email?: string;

  @IsEmpty()
  username?: string;

  bio?: string;

  @IsEmpty()
  image?: string;
}
