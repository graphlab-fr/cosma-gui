const {
        app, // app event lifecycle, events
        BrowserWindow, // app windows generator
        ipcMain, // interface of data exchange
    } = require('electron')
    , path = require('path');

const lang = require('../../core/models/lang');

const pageName = 'recordtype';

module.exports = {
    win: undefined,

    open: function (recordType, action) {
        if (this.win !== undefined) {
            this.win.focus();
            return;
        }

        const Display = require('../../models/display');

        this.win = new BrowserWindow(
            Object.assign(Display.getBaseSpecs('modal'), {
                title: lang.getFor(lang.i.windows[pageName].title[action]),
                parent: Display.getWindow('config'),
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

        ipcMain.once("get-recordtype", (event) => {
            event.returnValue = recordType;
        });

        ipcMain.once("get-action", (event) => {
            event.returnValue = action;
        });

        return this.win;
    },

    build: () => require('../build-page')(pageName, __dirname)
}