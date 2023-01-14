const {
        BrowserWindow, // app windows generator
        ipcMain
    } = require('electron')
    , path = require('path');

const lang = require('../../core/models/lang');

const pageName = 'history_update';

module.exports = {
    win: undefined,

    open: function (recordId) {
        if (this.win !== undefined) {
            this.win.focus();
            return;
        }

        const Display = require('../../models/display');

        this.win = new BrowserWindow(
            Object.assign(Display.getBaseSpecs('modal'), {
                title: lang.getFor(lang.i.windows[pageName].title),
                parent: Display.getWindow('history'),
                webPreferences: {
                    preload: path.join(__dirname, './preload.js')
                }
            })
        );

        this.win.loadFile(path.join(__dirname, `/dist/${lang.flag}.html`));

        this.win.once('ready-to-show', () => {
            this.win.show();
        });

        this.win.once('closed', () => {
            this.win = undefined;
        });

        ipcMain.once("get-record-id", (event) => {
            event.returnValue = recordId;
        });

        return this.win;
    },

    build: () => require('../build-page')(pageName, __dirname)
}