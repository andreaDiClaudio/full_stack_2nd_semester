import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { DataSource, DataSourceOptions } from "typeorm";
import * as dotenv from 'dotenv';
import { Category } from "src/category/entity/category.entity";
import { Entry } from "src/entry/entities/entry.entity";
import { UserEntity } from "src/authentication/entities/user";

dotenv.config();

export const dbConfig: TypeOrmModuleOptions = {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true, // Setting synchronize: true shouldn't be used in production - otherwise you can lose production data.
    entities: [Category, Entry, UserEntity],
    migrations: ['dist/src/migrations/*{.ts,.js}'],
}

const datasource = new DataSource(dbConfig as DataSourceOptions);
export default datasource;