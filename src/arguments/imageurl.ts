import { Argument, Possible } from 'klasa';

export default class extends Argument {
    async run(arg: string, possible: Possible): Promise<string | void> {
        if (
            /^(https?:\/\/)((([-a-z0-9]{1,})?(-?)+[-a-z0-9]{1,})(\.))+([a-z]{1,63})\/((([a-z0-9._\-~#%])+\/)+)?([a-z0-9._\-~#%]+)\.(jpg|jpeg|gif|png|bmp)$/i.test(
                arg,
            )
        )
            return arg;
        throw `${possible.name} debe ser una url válida`;
    }
}
