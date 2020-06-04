import { Client, KlasaClientOptions } from 'klasa';
// Esquemas y extensiones
import './extensions/HuskyGuild';
import './extensions/HuskyUser';
import './schemas/Guilds';
import './schemas/Permissions';

/**
 * @since 1.0.0
 * @class Husky
 * @extends external:Client
 * @description KlasaClient => Husky
 */

export class Husky extends Client {
    public emotes?: Record<string, string>;
    public constructor(options?: KlasaClientOptions) {
        super(options);
        this.emotes = {
            HUSKY_NEUTRAL: '<:husky_neutral:715894068034404392>',
        };
    }
}
