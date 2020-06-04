/* eslint-disable @typescript-eslint/ban-ts-ignore */
import { HuskyCommand } from '@lib/structures/HuskyCommand';
import { MessageEmbed } from 'discord.js';
import { CommandStore, KlasaMessage, util } from 'klasa';

export default class extends HuskyCommand {
    constructor(store: CommandStore, file: string[], directory: string) {
        super(store, file, directory, {
            name: 'help',
            enabled: true,
            runIn: ['text'],
            guarded: true,
            requiredPermissions: ['EMBED_LINKS'],
            description: (language) => language.get('COMMAND_HELP_DESCRIPTION'),
        });
    }

    public async run(message: KlasaMessage): Promise<KlasaMessage> {
        const help = new MessageEmbed().setAuthor(
            `${this.client.user.username} - Comandos`,
            this.client.user.displayAvatarURL({
                format: 'png',
                size: 1024,
                dynamic: true,
            }),
        );
        // @ts-ignore
        help.fields = await this.buildFields(message);
        return message.send(help);
    }

    private async buildFields(message): Promise<unknown[]> {
        const commands = await this.fetchCommands(message);
        const { prefix } = message.guildSettings;
        const commandNames = this.client.commands.map((command) => command.name);
        const longest = commandNames.reduce((long, str) => Math.max(long, str.length), 0);
        const fields = [];
        for (const [category, list] of commands) {
            fields.push({
                name: `**${category}**`,
                value: list
                    .map(
                        (command) =>
                            `\`${prefix}${command.name}${' '.repeat(longest - command.name.length)} ::\` ${
                                util.isFunction(command.description) ? command.description(message.language) : command.description
                            }`,
                    )
                    .join('\n'),
                inline: false,
            });
        }
        return fields;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private async fetchCommands(message): Promise<any> {
        const run = this.client.inhibitors.run.bind(this.client.inhibitors, message);
        const commands = new Map();
        await Promise.all(
            this.client.commands.map((command) =>
                run(command, true)
                    .then(() => {
                        const category = commands.get(command.category);
                        if (category) category.push(command);
                        else commands.set(command.category, [command]);
                    })
                    .catch(() => {
                        // noop
                    }),
            ),
        );

        return commands;
    }
}
