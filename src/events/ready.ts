/* eslint-disable @typescript-eslint/ban-ts-ignore */
import { EventStore, Event } from 'klasa';

export default class extends Event {
    constructor(store: EventStore, file: string[], directory: string) {
        super(store, file, directory, {
            enabled: true,
            once: true,
        });
    }

    async run(): Promise<void> {}
}
