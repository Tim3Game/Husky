/* eslint-disable @typescript-eslint/ban-ts-ignore */
import { EventStore, Event } from 'klasa';
import { GuildMember } from 'discord.js';

export default class extends Event {
    constructor(store: EventStore, file: string[], directory: string) {
        super(store, file, directory, {
            name: 'guildMemberAdd',
            enabled: true,
            event: 'guildMemberAdd',
            once: false,
        });
    }

    async run(member: GuildMember): Promise<void> {
        const { settings } = member.guild;
        const channelsCache = member.guild.channels.cache;
        // aqui se añaden los roles a los miembros
        if (settings.get('toggles.autoroles')) {
            if (!member.user.bot) {
                const roles = await member.guild.settings.get('roles.autoroles');
                member.roles.add(roles).catch(() => null);
            }
        }

        if (settings.get('welcome_image.enabled')) {
            if (channelsCache.has(settings.get('welcome_image.channel'))) {
                // @ts-ignore
                const image = await this.client.funcs.welcomeOrLeaveImage(
                    member.user.displayAvatarURL({
                        format: 'png',
                        size: 1024,
                    }),
                    member.user.tag,
                    'welcome',
                    settings.get('welcome_image'),
                );
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const channel: any = channelsCache.get(settings.get('welcome_image.channel'));
                channel
                    .send({
                        files: [
                            {
                                attachment: image,
                                name: `${member.user.id}.png`,
                            },
                        ],
                    })
                    .catch(() => null);
            }
        }
    }
}
