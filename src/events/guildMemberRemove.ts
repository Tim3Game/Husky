/* eslint-disable @typescript-eslint/ban-ts-ignore */
import { EventStore, Event } from 'klasa';
import { GuildMember } from 'discord.js';

export default class extends Event {
    constructor(store: EventStore, file: string[], directory: string) {
        super(store, file, directory, {
            name: 'guildMemberRemove',
            enabled: true,
            once: false,
        });
    }

    async run(member: GuildMember): Promise<void> {
        const { settings } = member.guild;
        const channelsCache = member.guild.channels.cache;

        if (settings.get('welcome_image.enabled')) {
            if (channelsCache.has(settings.get('leave_image.channel'))) {
                // @ts-ignore
                const image = await this.client.funcs.welcomeOrLeaveImage(
                    member.user.displayAvatarURL({
                        format: 'png',
                        size: 1024,
                    }),
                    member.user.tag,
                    'leave',
                    settings.get('leave_image'),
                );
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const channel: any = channelsCache.get(settings.get('leave_image.channel'));
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
