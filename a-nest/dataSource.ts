import dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { ChannelChats } from './src/output/entities/ChannelChats';
import { ChannelMembers } from './src/output/entities/ChannelMembers';
import { DMs } from './src/output/entities/DMs';
import { Channels } from './src/output/entities/Channels';
import { Mentions } from './src/output/entities/Mentions';
import { Users } from './src/output/entities/Users';
import { WorkspaceMembers } from './src/output/entities/WorkspaceMembers';
import { Workspaces } from './src/output/entities/Workspaces';

dotenv.config();

const dataSource = new DataSource({
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
  synchronize: false,
  logging: true,
  charset: 'utf8mb4_general_ci',
});

export default dataSource;
