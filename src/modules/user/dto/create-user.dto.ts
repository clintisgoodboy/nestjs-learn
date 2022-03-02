import { ApiOperation, ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: '用户名称'
  })
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
