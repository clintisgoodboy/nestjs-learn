import { PartialType } from '@nestjs/mapped-types';
import { IsInt, IsNotEmpty } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

// PartialType 表示继承所有属性，但是所有属性都是可选的，相当于只验证正确性，不验证存在性
export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsInt()
  @IsNotEmpty()
  id: number;
}
