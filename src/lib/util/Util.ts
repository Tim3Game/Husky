/* eslint-disable @typescript-eslint/explicit-function-return-type */
import nodeFetch, { RequestInit, Response } from 'node-fetch';
import { ImageSize, User } from 'discord.js';
import { KlasaUser } from 'klasa';
import { URL } from 'url';
export const IMAGE_EXTENSION = /\.(bmp|jpe?g|png|gif|webp)$/i;
export const enum FetchResultTypes {
    JSON,
    Buffer,
    Text,
    Result,
}
export const enum FetchMethods {
    Post = 'POST',
    Get = 'GET',
    Put = 'PUT',
    Delete = 'DELETE',
}
export async function fetch<R>(url: URL | string, type: FetchResultTypes.JSON): Promise<R>;
export async function fetch<R>(url: URL | string, options: RequestInit, type: FetchResultTypes.JSON): Promise<R>;
export async function fetch(url: URL | string, type: FetchResultTypes.Buffer): Promise<Buffer>;
export async function fetch(url: URL | string, options: RequestInit, type: FetchResultTypes.Buffer): Promise<Buffer>;
export async function fetch(url: URL | string, type: FetchResultTypes.Text): Promise<string>;
export async function fetch(url: URL | string, options: RequestInit, type: FetchResultTypes.Text): Promise<string>;
export async function fetch(url: URL | string, type: FetchResultTypes.Result): Promise<Response>;
export async function fetch(url: URL | string, options: RequestInit, type: FetchResultTypes.Result): Promise<Response>;
export async function fetch<R>(url: URL | string, options: RequestInit, type: FetchResultTypes): Promise<Response | Buffer | string | R>;
export async function fetch(url: URL | string, options: RequestInit | FetchResultTypes, type?: FetchResultTypes) {
    if (typeof options === 'undefined') {
        options = {};
        type = FetchResultTypes.JSON;
    } else if (typeof options === 'number') {
        type = options;
        options = {};
    } else if (typeof type === 'undefined') {
        type = FetchResultTypes.JSON;
    }

    const result: Response = await nodeFetch(url, options);
    if (!result.ok) throw new Error(await result.text());

    switch (type) {
        case FetchResultTypes.Result:
            return result;
        case FetchResultTypes.Buffer:
            return result.buffer();
        case FetchResultTypes.JSON:
            return result.json();
        case FetchResultTypes.Text:
            return result.text();
        default:
            throw new Error(`Unknown type ${type}`);
    }
}
export async function fetchAvatar(user: User, size: ImageSize = 512): Promise<Buffer> {
    const url = user.avatar ? user.avatarURL({ format: 'png', size }) : user.defaultAvatarURL;
    try {
        return await fetch(url, FetchResultTypes.Buffer);
    } catch (error) {
        throw `No se pudo descargar el avatar del perfil: ${error}`;
    }
}
export async function getMutualGuilds(user: KlasaUser): Promise<number> {
    const mutualGuilds = await user.client.shard.broadcastEval(
        `let ids = Array.from(this.guilds.cache.keys()), count = 0; for (let id of ids) if (this.guilds.cache.get(id).members.cache.has('${user.id}')) ++count; count;`,
    );
    return mutualGuilds.reduce((sum: number, val: number) => sum + val, 0);
}
