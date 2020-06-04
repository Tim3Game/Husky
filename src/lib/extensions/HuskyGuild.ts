import { Structures } from 'discord.js';
/**
 * @class HuskyGuild
 * @extends External: Structures
 * @since 1.0.1
 */
export class HuskyGuild extends Structures.get('Guild') {}
Structures.extend('Guild', () => HuskyGuild);
