import { HuskyCommand } from '../../../lib';
import { MessageEmbed } from 'discord.js';
import { CommandStore, KlasaMessage } from 'klasa';
export default class extends HuskyCommand {
    constructor(store: CommandStore, file: string[], directory: string) {
        super(store, file, directory, {
            name: 'invite',
            enabled: true,
            runIn: ['text'],
            guarded: true,
            requiredPermissions: ['EMBED_LINKS'],
            description: (language) => language.get('COMMAND_INVITE_DESCRIPTION'),
        });
    }

    public async run(message: KlasaMessage): Promise<KlasaMessage> {
        const invite = new MessageEmbed()
            .setAuthor(
                `${this.client.user.username} - Invitación`,
                this.client.user.displayAvatarURL({
                    format: 'png',
                    size: 1024,
                    dynamic: true,
                }),
            )
            .setColor('RED')
            .setDescription(message.language.get('COMANDO_INVITE', [this.client.invite]));
        return message.send(invite);
    }

    async init(): Promise<void> {
        if (this.client.application && !this.client.application.botPublic)
            this.permissionLevel = 10;
    }
}
