import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateCatDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt()
  age: number;

  @IsString()
  breed: string;
}
