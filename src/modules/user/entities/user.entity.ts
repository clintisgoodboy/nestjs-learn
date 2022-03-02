import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user')
export class User extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: '用户名' })
  @Column('varchar', {
    name: 'user_name',
    comment: '用户名'
  })
  userName: string;

  @ApiProperty()
  @Column('int', {
    comment: '年龄',
    nullable: true
  })
  age: number;

  @ApiProperty()
  @Column('int', {
    comment: '0未知 1男 2女',
    nullable: true
  })
  sex: number;
}
