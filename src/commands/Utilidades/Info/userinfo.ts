/* eslint-disable @typescript-eslint/ban-ts-ignore */
import { HuskyCommand } from '@lib/structures/HuskyCommand';
import { getMutualGuilds } from '@utils/Util';
import { MessageEmbed } from 'discord.js';
import { CommandStore, KlasaMessage, KlasaUser } from 'klasa';
import * as moment from 'moment';
moment.locale('es');
export default class extends HuskyCommand {
    public readonly status: object;
    public readonly activityTypes: object;
    constructor(store: CommandStore, file: string[], directory: string) {
        super(store, file, directory, {
            name: 'userinfo',
            aliases: ['user_info'],
            enabled: true,
            runIn: ['text'],
            cooldown: 10,
            requiredPermissions: ['EMBED_LINKS'],
            deletable: false,
            description: 'Muestra la información de un usuario',
            usage: '[miembro:username]',
        });
        this.status = {
            online: 'Conectado',
            idle: 'Ausente',
            dnd: 'No molestar',
            offline: 'Invisible',
        };
        this.activityTypes = {
            PLAYING: 'Jugando a',
            LISTENING: 'Escuchando',
            STREAMING: 'Transmitiendo',
            WATCHING: 'Viendo',
        };
    }

    public async run(message: KlasaMessage, [user = message.author]: [KlasaUser]): Promise<KlasaMessage> {
        const embed = new MessageEmbed()
            .setTitle(`Información del ${user.bot ? 'bot' : 'usuario'}`)
            .setColor('#2f3136')
            .addField('**Nombre**', user.tag)
            .addField('**ID**', user.id, true)
            .addField('**Bot**', user.bot ? '✅' : '❎')
            .addField('**Servidores compartidos**', await getMutualGuilds(user))
            .addField('**Fecha de creación**', `__${moment(user.createdAt.getTime()).format('L - LTS')}__`);
        if (message.guild.members.cache.has(user.id)) {
            const guildMember = message.guild.members.cache.get(user.id);
            const roles = guildMember.roles.cache.map((r) => r.name);
            embed
                .addField('**Fecha de unión**', `__${moment(message.member.joinedAt.getTime()).format('L - LTS')}__`)
                .addField('**Estado**', this.status[user.presence.status])
                .addField('**Apodo**', guildMember.nickname ? guildMember.nickname : '-')
                .addField('**Roles**', `${roles.length === 0 ? '-' : `${roles.length} - ${roles.join(', ')}`}`);
        }
        embed.setThumbnail(
            user.displayAvatarURL({
                format: 'png',
                dynamic: true,
                size: 1024,
            }),
        );
        return message.send(embed);
    }
}
