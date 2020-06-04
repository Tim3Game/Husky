import { HuskyCommand } from '@lib/structures/HuskyCommand';
import { MessageEmbed } from 'discord.js';
import { CommandStore, KlasaMessage } from 'klasa';
export default class extends HuskyCommand {
    constructor(store: CommandStore, file: string[], directory: string) {
        super(store, file, directory, {
            name: 'setnickname',
            enabled: true,
            runIn: ['text'],
            requiredPermissions: ['EMBED_LINKS', 'CHANGE_NICKNAME'],
            cooldown: 10,
            deletable: false,
            description: 'Cambia el nickname del bot',
            permissionLevel: 10,
            usage: '<nickname:string>',
        });
    }

    public async run(message: KlasaMessage, [nickname]: [string?]): Promise<KlasaMessage> {
        let description: string;
        if (nickname) {
            await message.guild.me.setNickname(nickname);
            description = `El apodo de ${this.client.user.username} ahora es **${nickname}** en este servidor.`;
        } else {
            await message.guild.me.setNickname('');
            description = `Se ha reiniciado el apodo de ${this.client.user.username} en este servidor.`;
        }
        return message.send(new MessageEmbed().setColor('GREEN').setDescription(description));
    }
}
