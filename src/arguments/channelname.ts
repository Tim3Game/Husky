import { Argument, util, KlasaGuild, KlasaMessage, Possible } from 'klasa';
import { Channel, Message } from 'discord.js';

const CHANNEL_REGEXP = Argument.regex.channel;

module.exports = class extends Argument {
    async run(arg: string, possible: Possible, msg: KlasaMessage): Promise<Channel | void> {
        if (!msg.guild) return this.store.get('channel').run(arg, possible, msg);
        const resChannel = this.resolveChannel(arg, msg.guild);
        if (resChannel) return resChannel;

        const results = [];
        const reg = new RegExp(util.regExpEsc(arg), 'i');
        for (const channel of msg.guild.channels.cache.values()) {
            if (reg.test(channel.name)) results.push(channel);
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let querySearch: any[];
        if (results.length > 0) {
            const regWord = new RegExp(`\\b${util.regExpEsc(arg)}\\b`, 'i');
            const filtered = results.filter((channel) => regWord.test(channel.name));
            querySearch = filtered.length > 0 ? filtered : results;
        } else {
            querySearch = results;
        }

        switch (querySearch.length) {
            case 0:
                throw `${possible.name} debe ser un nombre válido, ID o mención al canal`;
            case 1:
                return querySearch[0];
            default:
                throw `**Se encontraron múltiples coincidencias:** \`${querySearch
                    .map((channel) => channel.name)
                    .join('`, `')}\``;
        }
    }
    public resolveChannel(query: string | Channel | Message, guild: KlasaGuild): Channel | null {
        if (query instanceof Channel) return guild.channels.cache.has(query.id) ? query : null;
        if (query instanceof Message) return query.guild.id === guild.id ? query.channel : null;
        if (typeof query === 'string' && CHANNEL_REGEXP.test(query))
            return guild.channels.cache.get(CHANNEL_REGEXP.exec(query)[1]);
        return null;
    }
};
