/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { HuskyCommand } from '../../../lib';
import { util, CommandStore, KlasaMessage } from 'klasa';
export default class extends HuskyCommand {
    constructor(store: CommandStore, file: string[], directory: string) {
        super(store, file, directory, {
            name: 'update',
            description: 'Actualiza a Husky',
            guarded: true,
            hidden: true,
            permissionLevel: 10,
        });
    }

    public async run(message: KlasaMessage): Promise<KlasaMessage> {
        const execute = await util
            .exec('git pull origin master && npm run build', {
                timeout: 60000,
            })
            .catch((error) => ({ stdout: null, stderr: error }));
        this.client.console.log(
            `[Update]: ${execute.stdout ? execute.stdout : ''} ${
                execute.stderr ? execute.stderr : ''
            }`,
        );

        return message.send('**✅ | Archivos actualizados**');
    }
}
