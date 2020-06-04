import 'module-alias/register';
import { ShardingManager } from 'kurasuta';
import { join } from 'path';
import { Constants } from 'discord.js';
import { config } from 'dotenv';
import { Husky } from '@lib/HuskyClient';
import { CLIENT_OPTIONS } from './config';
Constants.DefaultOptions.ws.properties.$browser = 'Discord Android';

config();

const sharder: ShardingManager = new ShardingManager(join(__dirname, 'Husky'), {
    token: process.env.TOKEN,
    client: Husky,
    clientOptions: CLIENT_OPTIONS,
    shardCount: 'auto',
    ipcSocket: 9454,
    timeout: 60000,
});
sharder.spawn();
