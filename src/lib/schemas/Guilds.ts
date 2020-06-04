import { Client } from 'klasa';

export default Client.defaultGuildSchema
    .add('prefix', 'string', { filter: (_client, value) => (value as string).length > 10 })
    .add('language', 'Language', { configurable: false })
    .add('roles', (folder) =>
        folder
            .add('admin', 'Role')
            .add('moderator', 'Role')
            .add('auto', 'Role', { array: true })
            .add('muted', 'Role')
            .add('timed', 'any', { configurable: false }),
    );
