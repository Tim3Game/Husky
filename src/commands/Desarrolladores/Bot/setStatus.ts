import { HuskyCommand } from '@lib/structures/HuskyCommand';
import { MessageEmbed, PresenceStatusData } from 'discord.js';
import { CommandStore, KlasaMessage } from 'klasa';
export default class extends HuskyCommand {
    constructor(store: CommandStore, file: string[], directory: string) {
        super(store, file, directory, {
            name: 'setstatus',
            enabled: true,
            runIn: ['text'],
            requiredPermissions: ['EMBED_LINKS'],
            cooldown: 10,
            deletable: false,
            description: 'Cambia el estado del bot',
            permissionLevel: 10,
            usage: '<status:reg/^(?:online|idle|dnd|invisible)$/i>',
        });
    }

    public async run(message: KlasaMessage, [status]: [PresenceStatusData?]): Promise<KlasaMessage> {
        await this.client.user.setStatus(status);
        return message.send(new MessageEmbed().setColor('RED').setDescription(`El estado del bot ahora cambio a **${status}**`));
    }
}
