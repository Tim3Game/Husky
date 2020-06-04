/* eslint-disable @typescript-eslint/ban-ts-ignore */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Provider, ProviderStore, ProviderOptions, util } from 'klasa';
import { MongoClient } from 'mongodb';

export default class extends Provider {
    public db: null | any;
    public constructor(store: ProviderStore, file: string[], directory: string, options?: ProviderOptions) {
        super(store, file, directory, options);
        this.db = null;
    }

    public async init(): Promise<void> {
        const connection = util.mergeDefault(
            {
                host: 'localhost',
                port: 27017,
                db: 'klasa',
                options: {},
            },
            this.client.options.providers.mongodb,
        );

        const connectionString =
            this.client.options.providers.mongodb.connectionString ||
            `mongodb://${connection.user}:${connection.password}@${connection.host}:${connection.port}/${connection.db}`;

        const mongoClient = await MongoClient.connect(
            connectionString,
            util.mergeObjects(connection.options, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            }),
        );
        // @ts-ignore
        this.db = mongoClient.db(connection.db);
    }

    public get exec(): MongoClient {
        return this.db;
    }

    public async hasTable(table: string): Promise<boolean> {
        return this.db
            .listCollections()
            .toArray()
            .then((collections) => collections.some((col: { name: string }) => col.name === table));
    }

    public createTable(table: string): Promise<any> {
        return this.db.createCollection(table);
    }

    public deleteTable(table: string): Promise<any> {
        return this.db.dropCollection(table);
    }

    public getAll(table: string, filter = []): Promise<any[]> {
        if (filter.length)
            return this.db
                .collection(table)
                .find({ id: { $in: filter } }, { _id: 0 })
                .toArray();
        return this.db.collection(table).find({}, { _id: 0 }).toArray();
    }

    public getKeys(table: string): Promise<any> {
        return this.db.collection(table).find({}, { id: 1, _id: 0 }).toArray();
    }

    public get(table: string, id: string): Promise<any> {
        return this.db.collection(table).findOne(resolveQuery(id));
    }

    public has(table: string, id: string): Promise<boolean> {
        return this.get(table, id).then(Boolean);
    }

    public getRandom(table: string): Promise<any> {
        return this.db.collection(table).aggregate({ $sample: { size: 1 } });
    }

    public create(table: string, id: string, doc: object = {}): Promise<any> {
        return this.db.collection(table).insertOne(util.mergeObjects(this.parseUpdateInput(doc), resolveQuery(id)));
    }

    public delete(table: string, id: string): Promise<any> {
        return this.db.collection(table).deleteOne(resolveQuery(id));
    }

    public update(table: string, id: string, doc: any): Promise<any> {
        return this.db.collection(table).updateOne(resolveQuery(id), {
            $set: util.isObject(doc) ? flatten(doc) : parseEngineInput(doc),
        });
    }

    public replace(table: string, id: string, doc: any): Promise<any> {
        return this.db.collection(table).replaceOne(resolveQuery(id), this.parseUpdateInput(doc));
    }
}

function resolveQuery(query): object {
    if (util.isObject(query)) return query;
    else {
        return { id: query };
    }
}
function flatten(obj, path = ''): any {
    let output = {};
    for (const [key, value] of Object.entries(obj)) {
        if (util.isObject(value)) output = Object.assign(output, flatten(value, path ? `${path}.${key}` : key));
        else output[path ? `${path}.${key}` : key] = value;
    }
    return output;
}

function parseEngineInput(updated): any {
    return Object.assign(
        {},
        ...updated.map((entry) => ({
            [entry.data[0]]: entry.data[1],
        })),
    );
}
