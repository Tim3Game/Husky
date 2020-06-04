import { BaseCluster } from 'kurasuta';
import { TOKENS } from '@root/config';

export default class extends BaseCluster {
    protected launch(): void | Promise<void> {
        this.client.login(TOKENS.BOT_TOKEN);
    }
}
