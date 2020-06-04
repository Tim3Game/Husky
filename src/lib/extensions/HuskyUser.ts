import { Structures } from 'discord.js';
/**
 * @class HuskyUser
 * @extends External: User
 * @since 1.0.0
 */
export class HuskyUser extends Structures.get('User') {}
Structures.extend('User', () => HuskyUser);
