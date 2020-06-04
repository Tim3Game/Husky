declare module 'discord.js' {
    interface WebSocketOptions {
        properties?: {
            $browser?: string;
        };
    }
    interface MessageEmbed {
        addBetterField(title?: string, content?: string, extraSpace?: boolean): this;
    }
}
