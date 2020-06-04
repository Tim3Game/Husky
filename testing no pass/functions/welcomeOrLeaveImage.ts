import { Function } from '@kcp/functions';
import { resolve, join } from 'path';
import { Canvas } from 'canvas-constructor';
import fetch from 'node-fetch';

Canvas.registerFont(
    resolve(join(__dirname, '..', '..', 'assets', 'fonts', 'FredokaOne-Regular.ttf')),
    'FredokaOne Regular',
);

export default class extends Function {
    async run(
        avataURL: string,
        memberTag: string,
        type: string,
        { background, welcomeOrLeaveColor, circleColor, usernameColor, messageColor, message },
    ): Promise<Buffer> {
        if (type === 'welcome') {
            type = 'BIENVENID@';
        } else if (type === 'leave') {
            type = 'ADIÓS';
        }
        const avatar = await fetch(avataURL)
            .then((res) => res.buffer())
            .catch(() => null);
        const _background = await fetch(background)
            .then((res) => res.buffer())
            .catch(() => null);
        const canvasImage = new Canvas(1024, 450);
        if (_background instanceof Buffer) {
            canvasImage.addImage(_background, 0, 0);
        }
        canvasImage
            .addCircularImage(avatar, 512, 130, 110)
            .beginPath()
            .arc(512, 130, 110, 0, 2 * Math.PI, false)
            .setLineWidth(10)
            .setStroke(circleColor)
            .stroke()
            .save()
            .restore()
            .setShadowColor('rgba(22, 22, 22, 1)')
            .setShadowOffsetY(5)
            .setShadowBlur(10)
            .setTextAlign('center')
            .setColor(welcomeOrLeaveColor)
            .setTextFont('50pt FredokaOne Regular')
            .addText(type, 512, 310)
            .setTextAlign('center')
            .setColor(usernameColor)
            .setTextFont('50pt FredokaOne Regular')
            .addResponsiveText(memberTag, 512, 375, 600);
        if (typeof message === 'string') {
            canvasImage
                .setTextAlign('center')
                .setColor(messageColor)
                .setTextFont('40pt FredokaOne Regular')
                .addResponsiveText(message, 512, 425, 600);
        }
        return canvasImage.toBufferAsync();
    }
}
