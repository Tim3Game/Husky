/* eslint-disable @typescript-eslint/ban-ts-ignore */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { HuskyUtil, HuskyCommand } from '../../../lib';
import { CommandStore, KlasaMessage } from 'klasa';
import { MessageEmbed, TextChannel } from 'discord.js';

export default class extends HuskyCommand {
    constructor(store: CommandStore, file: string[], directory: string) {
        super(store, file, directory, {
            name: 'leaveimage',
            aliases: ['leaveimg'],
            permissionLevel: 6,
            subcommands: true,
            enabled: true,
            runIn: ['text'],
            cooldown: 4,
            deletable: false,
            description: 'Configura la imagen de despedida',
            usage: '<message|background|channel|color|on|off|info:default> (key:key) [...]',
            usageDelim: ' ',
        });

        this
            // eslint-disable-next-line consistent-return
            .createCustomResolver('key', (arg, possible, message, [action]) => {
                if (['on', 'off'].includes(action) || arg) return arg;
            });
    }

    public async info(message: KlasaMessage): Promise<void> {
        const { settings } = message.guild;
        const infoEmbed = new MessageEmbed()
            .setAuthor(
                'Imagen de despedida',
                this.client.user.avatarURL({
                    format: 'png',
                    size: 1024,
                }),
            )
            .setColor('RANDOM')
            .addField(
                'Uso',
                message.language.get('COMANDO_LEAVEIMAGE_USO', [settings.get('prefix')]),
            );
        await message.send(infoEmbed);
    }

    public async channel(message: KlasaMessage, [name]: [string]): Promise<KlasaMessage> {
        if (!name) return message.sendLocale('COMANDO_LEAVEIMAGE_SUB_CHANNEL_NO_CANAL');
        const channel = await this.client.arguments
            .get('channelname')
            // @ts-ignore
            .run(name, { name: name }, message);
        if (channel instanceof TextChannel) {
            const { settings } = message.guild;
            await settings
                .update('leave_image.channel', channel.id)
                .then(() =>
                    message
                        .sendLocale('COMANDO_LEAVEIMAGE_SUB_CHANNEL_ACTUALIZADO', [
                            channel.toString(),
                        ])
                        .then((msg) => msg.delete({ timeout: 10000 })),
                );
        }
    }

    public async message(message: KlasaMessage, [...value]: [string]): Promise<unknown> {
        if (!value)
            return message
                .sendLocale('COMANDO_LEAVEIMAGE_SUB_NO_MSG')
                .then((msg) => msg.delete({ timeout: 10000 }));
        const { settings } = message.guild;
        await settings
            .update('leave_image.message', value.join(' '))
            .then(() =>
                message
                    .sendLocale('COMANDO_LEAVEIMAGE_SUB_MSG_ACTUALIZADO')
                    .then((msg) => msg.delete({ timeout: 10000 })),
            );
    }

    public async background(message: KlasaMessage, [url]: [string]): Promise<void> {
        if (
            /^(https?:\/\/)((([-a-z0-9]{1,})?(-?)+[-a-z0-9]{1,})(\.))+([a-z]{1,63})\/((([a-z0-9._\-~#%])+\/)+)?([a-z0-9._\-~#%]+)\.(jpg|jpeg|gif|png|bmp)$/i.test(
                url,
            )
        ) {
            const { settings } = message.guild;
            if (message.deletable) await message.delete().catch(() => null);
            await settings
                .update('leave_image.background', url)
                .then(() =>
                    message
                        .sendLocale('COMANDO_LEAVEIMAGE_SUB_BACKGROUND_ACTUALIZADO')
                        .then((msg) => msg.delete({ timeout: 10000 })),
                );
        } else {
            message
                .sendLocale('COMANDO_LEAVEIMAGE_SUB_BACKGROUND_NO_URL')
                .then((msg) => msg.delete({ timeout: 10000 }));
        }
    }

    public async color(message: KlasaMessage, [prop, color]: [string, string]): Promise<unknown> {
        const { settings } = message.guild;
        prop = prop ? prop.toUpperCase() : null;
        color = color ? color.toUpperCase() : null;
        if (!this.checkProp(prop))
            return message
                .sendLocale('COMANDO_LEAVEIMAGE_SUB_COLOR_SIN_PROPIEDAD')
                .then((msg) => msg.delete({ timeout: 10000 }));
        if (!this.checkColor(color))
            return message
                .sendLocale('COMANDO_LEAVEIMAGE_SUB_COLOR_SIN_COLOR')
                .then((msg) => msg.delete({ timeout: 10000 }));
        if (message.deletable) await message.delete().catch(() => null);
        // eslint-disable-next-line max-len
        await settings
            .update(`leave_image.${this.checkProp(prop)}`, this.checkColor(color))
            .then(() =>
                message
                    .sendLocale('COMANDO_LEAVEIMAGE_SUB_COLOR_ACTUALIZADO')
                    .then((msg) => msg.delete({ timeout: 10000 })),
            );
    }
    public async on(message: KlasaMessage): Promise<void> {
        const { settings } = message.guild;
        if (message.deletable) await message.delete().catch(() => null);
        await settings
            .update('leave_image.enabled', true)
            .then(() =>
                message
                    .sendLocale('COMANDO_LEAVEIMAGE_ACTIVADO')
                    .then((msg) => msg.delete({ timeout: 10000 })),
            );
    }

    public async off(message: KlasaMessage): Promise<void> {
        const { settings } = message.guild;
        if (message.deletable) await message.delete().catch(() => null);
        await settings
            .update('leave_image.enabled', false)
            .then(() =>
                message
                    .send('COMANDO_LEAVEIMAGE_DESACTIVADO')
                    .then((msg) => msg.delete({ timeout: 10000 })),
            );
    }
    public checkProp(value: string): string | null {
        switch (value) {
            case 'CIRCLE':
                return 'circleColor';
            case 'MESSAGE':
                return 'messageColor';
            case 'LEAVE':
                return 'welcomeOrLeaveColor';
            case 'USERNAME':
                return 'usernameColor';
            default:
                return null;
        }
    }

    public checkColor(color: string) {
        switch (color) {
            case 'RANDOM':
                return HuskyUtil.getRandomColor();
            case 'DEFAULT':
                return '#ffffff';
            default:
                if (/^#?[0-9a-f]{6}$/i.test(color)) return color;
                return null;
        }
    }
}
