/**
 * @file Cosmoscope displaying
 * @author Guillaume Brioudes
 * @copyright GNU GPL 3.0 ANR HyperOtlet
 */

const {
        ipcMain,
        shell,
        BrowserWindow // app windows generator
    } = require('electron')
    , path = require('path');

const Display = require('../../models/display');

const pageName = 'main';

const winCosmoscope = {
    win: undefined,

    open: function () {
        if (this.win !== undefined) {
            this.win.focus();
            return;
        }

        let windowSpecs = Display.getWindowSpecs(pageName);

        this.win = new BrowserWindow(
            Object.assign(windowSpecs, {
                webPreferences: {
                    preload: path.join(__dirname, './preload.js')
                },
                title: 'Cosma'
            })
        );

        if (windowSpecs.maximized === true) {
            this.win.maximize(); }

        Display.storeSpecs(pageName, this.win);

        this.win.on('resized', () => {
            Display.storeSpecs(pageName, this.win);
        });

        this.win.on('moved', () => {
            Display.storeSpecs(pageName, this.win);
        });

        this.win.on('maximize', () => {
            Display.storeSpecs(pageName, this.win);
        });

        this.win.on('unmaximize', () => {
            windowSpecs = Display.getWindowSpecs(pageName);
            this.win.setSize(windowSpecs.width, windowSpecs.height, true);
            this.win.setPosition(windowSpecs.x, windowSpecs.y, true);
            Display.storeSpecs(pageName, this.win);
        });

        require('../../controllers/cosmoscope')(undefined, true);

        this.win.once('close', () => {
            Display.emptyWindow(pageName);
        });

        this.win.once('closed', () => {
            this.win = undefined;
        });

        this.win.webContents.on('will-navigate', function(e, url) {
            e.preventDefault();
            shell.openExternal(url);
        });

        return this.win;
    }
}

module.exports = winCosmoscope;

ipcMain.on("askReload", () => { winCosmoscope.win.reload(); });

ipcMain.on("askBack", () => {
    if (winCosmoscope.win.webContents.canGoBack()) {
        this.win.webContents.goBack();
    };
});

ipcMain.on("askForward", () => {
    if (winCosmoscope.win.webContents.canGoForward()) {
        winCosmoscope.win.webContents.goForward();
    };
});

ipcMain.on("askShare", () => {
    require('../export').open();
});

ipcMain.on("askRecordNew", () => {
    require('../record').open();
});

ipcMain.on("askCosmoscopeNew", () => {
    require('../../controllers/cosmoscope')();
});