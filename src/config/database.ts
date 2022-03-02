import { join } from 'path';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const database: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'admin',
  database: 'nest', // 请先手动创建名称nest的数据库
  entities: [join(__dirname, '../', '**/**.entity{.ts,.js}')], //自动检测包含entity的文件，并引入
  synchronize: true,
  timezone: '+08:00', // 东八区
  charset: 'utf8mb4' // 如果需要保存emoji表情包 需指定该字符  ！还有字段里面得格式
  // logging: false, 是否打印记录
};

export default database;
