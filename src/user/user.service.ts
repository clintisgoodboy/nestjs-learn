import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private connection: Connection
  ) {}

  /**
   * 这里写了二种操作数据库的方法
   * * 简单的用 userRepository
   * * 复杂的用 connection
   */

  async create(createUserDto: CreateUserDto) {
    // await this.connection
    //   .createQueryBuilder()
    //   .insert()
    //   .into(User)
    //   .values([createUserDto])
    //   .execute();
    await this.userRepository.insert(createUserDto);

    return '插入成功';
  }

  findAll() {
    // const users: User[] = await this.connection
    //   .createQueryBuilder()
    //   .select('user')
    //   .from(User, 'user')
    //   .getMany();

    // return users;

    return this.userRepository.find();
  }

  findOne(id: number) {
    // const user: User = await this.connection
    //   .createQueryBuilder()
    //   .select('user')
    //   .from(User, 'user')
    //   .where('user.id = :id', { id: id })
    //   .getOne();
    // return user;

    return this.userRepository.findOne(id);
  }

  async update(updateUserDto: UpdateUserDto) {
    // await this.connection
    //   .createQueryBuilder()
    //   .update(User)
    //   .set(updateUserDto)
    //   .where('id = :id', { id: id })
    //   .execute();

    await this.userRepository.save(updateUserDto);

    return '修改成功';
  }

  async remove(id: number) {
    // await this.connection
    //   .createQueryBuilder()
    //   .delete()
    //   .from(User)
    //   .where('id = :id', { id: id })
    //   .execute();

    await this.userRepository.delete(id);

    return '删除成功';
  }
}
