import { HuskyCommand } from '@lib/structures/HuskyCommand';
import { MessageEmbed } from 'discord.js';
import { CommandStore, KlasaMessage } from 'klasa';
export default class extends HuskyCommand {
    constructor(store: CommandStore, file: string[], directory: string) {
        super(store, file, directory, {
            name: 'avatar',
            enabled: true,
            runIn: ['text'],
            requiredPermissions: ['EMBED_LINKS'],
            cooldown: 10,
            deletable: false,
            description: 'Muestra el avatar de un usuario',
            usage: '[miembro:username]',
        });
    }

    public async run(message: KlasaMessage, [member = message.author]): Promise<KlasaMessage> {
        const avatar = new MessageEmbed()
            .setAuthor(
                member.tag,
                member.displayAvatarURL({
                    format: 'png',
                    dynamic: true,
                    size: 1024,
                }),
            )
            .addBetterField(
                'Links',
                `[webp](${member.displayAvatarURL({
                    format: 'webp',
                    size: 1024,
                })}) | [png](${member.displayAvatarURL({
                    format: 'png',
                    size: 1024,
                })}) | [jpg](${member.displayAvatarURL({
                    format: 'jpg',
                    size: 1024,
                })}) | [jpeg](${member.displayAvatarURL({
                    format: 'jpeg',
                    size: 1024,
                })})`,
            )
            .setColor(message.member.displayColor)
            .setImage(
                member.displayAvatarURL({
                    format: 'png',
                    dynamic: true,
                    size: 1024,
                }),
            );
        if (message.author !== member) {
            avatar.setFooter(
                `Pedido por ${message.author.tag}`,
                message.author.displayAvatarURL({
                    format: 'png',
                    dynamic: true,
                    size: 1024,
                }),
            );
        }
        avatar.setTimestamp(new Date());

        return message.send(avatar);
    }
}
