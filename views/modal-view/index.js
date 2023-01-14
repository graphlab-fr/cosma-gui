const {
        app, // app event lifecycle, events
        BrowserWindow, // app windows generator
        ipcMain, // interface of data exchange
        clipboard
    } = require('electron')
    , path = require('path');

const lang = require('../../core/models/lang');

const pageName = 'view';

module.exports = {
    win: undefined,

    open: function (viewName, action) {
        if (this.win !== undefined) {
            this.win.focus();
            return;
        }

        const Display = require('../../models/display');

        const { win: parent } = require('../cosmoscope');

        this.win = new BrowserWindow(
            Object.assign(Display.getBaseSpecs('modal'), {
                title: lang.getFor(lang.i.windows[pageName].title[action]),
                parent,
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

        ipcMain.once("get-view-name", (event) => {
            event.returnValue = viewName;
        });

        ipcMain.once("get-view-key", (event) => {
            // the key is store on clipboard from the cosmoscope.html
            event.returnValue = clipboard.readText();
        });

        ipcMain.once("get-action", (event) => {
            event.returnValue = action;
        });

        ipcMain.once("close", (event) => {
            if (this.win !== undefined) {
                this.win.close();
            }
        });

        return this.win;
    },

    build: () => require('../build-page')(pageName, __dirname)
}