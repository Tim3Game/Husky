import { HuskyCommand } from '@lib/structures/HuskyCommand';
import { MessageEmbed, version as discordVersion } from 'discord.js';
import { CommandStore, KlasaMessage, Duration, version as klasaVersion } from 'klasa';

export default class extends HuskyCommand {
    constructor(store: CommandStore, file: string[], directory: string) {
        super(store, file, directory, {
            name: 'stats',
            enabled: true,
            requiredPermissions: ['EMBED_LINKS'],
            runIn: ['text'],
            guarded: true,
            description: (language) => language.get('COMMAND_STATS_DESCRIPTION'),
        });
    }

    async run(message: KlasaMessage): Promise<KlasaMessage> {
        let [users, guilds, channels, memory] = [0, 0, 0, 0];
        if (this.client.shard) {
            const results = await this.client.shard.broadcastEval(
                `[this.guilds.cache.reduce((a, b) => b.memberCount + a, 0), this.guilds.cache.size, this.channels.cache.size, (process.memoryUsage().heapUsed / 1024 / 1024)]`,
            );
            for (const result of results) {
                users += result[0];
                guilds += result[1];
                channels += result[2];
                memory += result[3];
            }
        }
        const embed = new MessageEmbed()
            .setAuthor(
                this.client.user.username,
                this.client.user.displayAvatarURL({
                    format: 'png',
                    size: 1024,
                    dynamic: true,
                }),
            )
            .setColor('GREEN')
            .addBetterField('• Uso Memoria', `${(memory || process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`)
            .addBetterField('• T. Actividad', Duration.toNow(Date.now() - process.uptime() * 1000))
            .addBetterField('• Usuarios', (users || this.client.users.cache.size).toLocaleString())
            .addBetterField('• Servidores', (guilds || this.client.guilds.cache.size).toLocaleString())
            .addBetterField('• Canales', (channels || this.client.channels.cache.size).toLocaleString())
            .addBetterField('• Klasa', `v${klasaVersion}`)
            .addBetterField('• Discord.js', `v${discordVersion}`)
            .addBetterField('• Node.js', process.version)
            .addBetterField('• Shard', `${(message.guild ? message.guild.shardID : 0) + 1} / ${this.client.options.shardCount}`);

        return message.send(embed);
    }
}
