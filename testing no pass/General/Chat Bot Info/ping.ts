/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { HuskyCommand } from '../../../lib';
import { CommandStore, KlasaMessage } from 'klasa';
import { MessageEmbed } from 'discord.js';
export default class extends HuskyCommand {
    constructor(store: CommandStore, file: string[], directory: string) {
        super(store, file, directory, {
            name: 'ping',
            description: (language) => language.get('COMMAND_PING_DESCRIPTION'),
            guarded: true,
            requiredPermissions: ['EMBED_LINKS'],
        });
    }

    public async run(message: KlasaMessage): Promise<KlasaMessage> {
        const embed = new MessageEmbed().setColor('BLUE').setFooter(
            'Ping...',
            this.client.user.displayAvatarURL({
                format: 'png',
                size: 1024,
            }),
        );
        const msg = await message.send(embed);
        const embedPing = new MessageEmbed()
            .setAuthor(
                this.client.user.tag,
                this.client.user.displayAvatarURL({
                    format: 'png',
                    size: 1024,
                }),
            )
            .addBetterField(
                '• Tiempo de respuesta',
                `${
                    (msg.editedTimestamp || msg.createdTimestamp) -
                    (message.editedTimestamp || message.createdTimestamp)
                }ms`,
            )
            .addBetterField('• Discord API', `${Math.round(this.client.ws.ping)}ms`);
        return msg.edit({ embed: embedPing });
    }
}
