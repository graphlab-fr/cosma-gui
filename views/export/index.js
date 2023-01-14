const { BrowserWindow } = require('electron')
    , path = require('path')

const lang = require('../../core/models/lang');

const pageName = 'export';

module.exports = {
    win: undefined,

    open: function () {
        if (this.win !== undefined) {
            return;
        }

        const Display = require('../../models/display');

        const { win: parent } = require('../cosmoscope');

        this.win = new BrowserWindow(
            Object.assign(Display.getBaseSpecs('modal'), {
                title: lang.getFor(lang.i.windows[pageName].title),
                parent,
                height: 220,
                webPreferences: {
                    preload: path.join(__dirname, './preload.js')
                }
            })
        );

        Display.storeSpecs('export', this.win);

        this.win.loadFile(path.join(__dirname, `/dist/${lang.flag}.html`));

        this.win.once('ready-to-show', () => {
            this.win.show();
        });

        this.win.once('closed', () => {
            this.win = undefined;
        });

        return this.win;
    },

    build: () => require('../build-page')(pageName, __dirname)
}