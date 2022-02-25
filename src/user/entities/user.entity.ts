import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', {
    name: 'user_name',
    comment: '用户名'
  })
  userName: string;

  @Column('int', {
    comment: '年龄',
    nullable: true
  })
  age: number;

  @Column('int', {
    comment: '0未知 1男 2女',
    nullable: true
  })
  sex: number;
}
