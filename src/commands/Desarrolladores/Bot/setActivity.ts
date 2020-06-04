import { HuskyCommand } from '@lib/structures/HuskyCommand';
import { MessageEmbed } from 'discord.js';
import { CommandStore, KlasaMessage } from 'klasa';
export default class extends HuskyCommand {
    constructor(store: CommandStore, file: string[], directory: string) {
        super(store, file, directory, {
            name: 'setactivity',
            enabled: true,
            runIn: ['text'],
            requiredPermissions: ['EMBED_LINKS'],
            cooldown: 10,
            deletable: false,
            description: 'Comando de prueva',
            permissionLevel: 10,
            usage: '<tipo:string> <actividad:string>',
            usageDelim: ',',
        });
    }

    public async run(message: KlasaMessage, [type, activity]: [any, string?]): Promise<KlasaMessage> {
        const types = ['PLAYING', 'STREAMING', 'LISTENING', 'WATCHING'];
        type = type.toUpperCase();
        if (!types.includes(type))
            return message.send(new MessageEmbed().setFooter(`Tipo no soportado, usa los siguientes tipos: ${types.join(', ')}`));
        if (type && activity) {
            await this.client.user.setActivity(activity, { type: type });
        }
    }
}
