import { IsEmail, IsEmpty, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsEmail()
  email: string;

  @IsEmpty()
  username: string;

  bio: string;

  @IsEmpty()
  image: string;
}
