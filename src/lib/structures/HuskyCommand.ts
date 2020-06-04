import { PermissionResolvable, Permissions } from 'discord.js';
import { Command, CommandOptions, CommandStore, KlasaMessage, util } from 'klasa';

export abstract class HuskyCommand extends Command {
    public requiredGuildPermissions: Permissions;
    public constructor(
        store: CommandStore,
        file: string[],
        directory: string,
        options: HuskyCommandOptions = {},
    ) {
        super(store, file, directory, util.mergeDefault({ requiredGuildPermissions: 0 }, options));
        this.requiredGuildPermissions = new Permissions(options.requiredGuildPermissions);
    }
    public run(message: KlasaMessage, _params: any[]): any {
        return message;
    }
}

export interface HuskyCommandOptions extends CommandOptions {
    requiredGuildPermissions?: PermissionResolvable;
}
