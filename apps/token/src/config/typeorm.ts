import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import fs from 'fs';
import path from 'path';

const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = process.env.NODE_ENV === 'development';

const config: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT!, 10),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  synchronize: isDevelopment,
  entities: ['dist/apps/token/**/*.entity{.ts,.js}'],
  migrations: ['dist/apps/token/migrations/*{.ts,.js}'],
  ssl: isProduction
    ? {
        rejectUnauthorized: true,
        ca: fs
          .readFileSync(path.resolve(__dirname, '../ssl/ca-certificate.crt'))
          .toString(),
      }
    : undefined,
};

export default registerAs('typeorm', () => config);
