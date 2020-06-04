import { PermissionLevels } from 'klasa';

export default new PermissionLevels()
    .add(0, () => true)
    .add(
        3,
        ({ member, guild }) => {
            if (!guild || !member) return false;
            return member.roles.cache.has(guild.settings.get('roles.staff'));
        },
        { fetch: true },
    )
    .add(
        4,
        ({ member, guild }) => {
            if (!guild || !member) return false;
            return member.roles.cache.has(guild.settings.get('roles.mod'));
        },
        { fetch: true },
    )
    .add(
        5,
        ({ member, guild }) => {
            if (!guild || !member) return false;
            return (
                member.roles.cache.has(guild.settings.get('roles.mod')) ||
                (member.permissions.has('BAN_MEMBERS') && member.permissions.has('KICK_MEMBERS'))
            );
        },
        { fetch: true },
    )
    .add(
        6,
        ({ member, guild }) => {
            if (!guild || !member) return false;
            return (
                member.roles.cache.has(guild.settings.get('roles.admin')) ||
                (member.permissions.has('ADMINISTRATOR') && member.permissions.has('MANAGE_GUILD'))
            );
        },
        { fetch: true },
    )
    .add(
        7,
        ({ member, guild }) => {
            if (!guild || !member) return false;
            return member === guild.owner;
        },
        { fetch: true },
    )
    .add(9, ({ author, client }) => client.owners.has(author), {
        break: true,
    })
    .add(10, ({ author, client }) => client.owners.has(author));
