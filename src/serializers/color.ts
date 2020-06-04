import { Serializer, Language, SchemaPiece } from 'klasa';

export default class extends Serializer {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    deserialize(data: string, piece: SchemaPiece, language: Language): any {
        if (/^#?[0-9a-f]{6}$/i.test(data)) return data;
        throw language.get('RESOLVER_INVALID_COLOR', piece.key);
    }
}
