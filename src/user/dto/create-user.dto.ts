import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  userName: string;

  @IsInt()
  @IsOptional()
  age?: number;

  @IsInt()
  @IsOptional()
  sex?: number;
}
