const {
        BrowserWindow
    } = require('electron')
    , path = require('path')

const lang = require('../../core/models/lang');

const pageName = 'history';

module.exports = {
    win: undefined,

    open: function () {
        if (this.win !== undefined) {
            this.win.focus();
            return;
        }

        const Display = require('../../models/display');

        let windowSpecs = Display.getWindowSpecs(pageName);

        this.win = new BrowserWindow(
            Object.assign(windowSpecs, {
                title: lang.getFor(lang.i.windows[pageName].title),
                webPreferences: {
                    preload: path.join(__dirname, './preload.js')
                }
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

        this.win.loadFile(path.join(__dirname, `/dist/${lang.flag}.html`));

        this.win.once('ready-to-show', () => {
            this.win.show();
        });

        this.win.once('close', () => {
            Display.emptyWindowDisplay(pageName);
        });

        this.win.once('closed', () => {
            this.win = undefined;
        });

        return this.win;
    },

    build: () => require('../build-page')(pageName, __dirname)
}