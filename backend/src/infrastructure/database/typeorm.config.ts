import { DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export const typeOrmConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.PROJECT_DB_HOST,
  port: Number(process.env.PROJECT_DB_PORT),
  username: process.env.PROJECT_DB_USER,
  password: process.env.PROJECT_DB_PASSWORD,
  database: process.env.PROJECT_DB_NAME,

  entities: [path.join(__dirname, '../../**/*.entity{.ts,.js}')],
  migrations: [path.join(__dirname, './migrations/*{.ts,.js}')],

  synchronize: false,
};
