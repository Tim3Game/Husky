import { MessageEmbed } from 'discord.js';
import { Extendable, ExtendableStore } from 'klasa';

export default class extends Extendable {
    private description: string;

    constructor(store: ExtendableStore, file: string[], directory: string) {
        super(store, file, directory, {
            appliesTo: [MessageEmbed],
        });
    }

    public addBetterField(title?: string, content?: string, extraSpace = false): this {
        this.description = this.description || '';
        this.description += `${extraSpace ? '\n' : ''}\n**${title}:** ${content}`;
        return this;
    }
}
