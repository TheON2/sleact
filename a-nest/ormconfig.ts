import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import dotenv from 'dotenv';
import { ChannelChats } from './src/output/entities/ChannelChats';
import { ChannelMembers } from './src/output/entities/ChannelMembers';
import { Channels } from './src/output/entities/Channels';
import { DMs } from './src/output/entities/DMs';
import { Mentions } from './src/output/entities/Mentions';
import { Users } from './src/output/entities/Users';
import { WorkspaceMembers } from './src/output/entities/WorkspaceMembers';
import { Workspaces } from './src/output/entities/Workspaces';

dotenv.config();
const config: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [
    ChannelChats,
    ChannelMembers,
    Channels,
    DMs,
    Mentions,
    Users,
    WorkspaceMembers,
    Workspaces,
  ],
  migrations: [__dirname + '/src/migrations/*.ts'],
  // cli: { migrationsDir: 'src/migrations' },
  autoLoadEntities: true,
  charset: 'utf8mb4',
  synchronize: false,
  logging: true,
  keepConnectionAlive: true,
};

export = config;
