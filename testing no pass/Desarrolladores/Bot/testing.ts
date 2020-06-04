import { HuskyCommand } from '../../../lib';
import { MessageEmbed } from 'discord.js';
import { CommandStore, KlasaMessage } from 'klasa';
export default class extends HuskyCommand {
    constructor(store: CommandStore, file: string[], directory: string) {
        super(store, file, directory, {
            name: 'test',
            enabled: true,
            runIn: ['text'],
            requiredPermissions: ['EMBED_LINKS'],
            cooldown: 10,
            deletable: false,
            description: 'Comando de prueva',
        });
    }

    public async run(message: KlasaMessage): Promise<KlasaMessage> {
        const avatar = new MessageEmbed().addField('**Info**', '`-help      ::`', true);

        return message.send(avatar);
    }
}
