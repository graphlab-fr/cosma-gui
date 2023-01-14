const {
    BrowserWindow, // app windows generator
    ipcMain
} = require('electron')
, path = require('path');

const Display = require('../../models/display');

const lang = require('../../core/models/lang');

const pageName = 'report';

module.exports = {
    win: undefined,

    open: function () {
        if (this.win !== undefined) {
            this.win.focus();
            return;
        }

        const { win: parent } = require('../history');

        this.win = new BrowserWindow(
            Object.assign(Display.getBaseSpecs('form'), {
                title: `${lang.getFor(lang.i.windows[pageName].title)}`,
                parent,
                width: 700,
                height: 700,
                webPreferences: {
                    preload: path.join(__dirname, './preload.js')
                }
            })
        );

        Display.storeSpecs(pageName, this.win);

        this.win.once('closed', () => {
            this.win = undefined;
        });

        return this.win;
    }
}