import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { DataSource, DataSourceOptions } from 'typeorm';

// Load .env file
dotenv.config({ path: path.resolve(__dirname, '..', '..', '.env') });

export const TypeORMConfig: DataSourceOptions & TypeOrmModuleOptions = {
  type: process.env.DB_TYPE as any,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: false, // Set to true to enable automatic synchronization
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/database/migrations/*.js'],
  autoLoadEntities: true,
  migrationsTableName: 'Migrations_History',
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

const dataSource = new DataSource(TypeORMConfig);

export default dataSource;