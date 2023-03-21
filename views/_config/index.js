const {
    BrowserWindow,
    app
} = require('electron')
, path = require('path');

const { devServer } = require('../../utils/webpack.config')

const Display = require('../../models/display');

const pageName = 'config';

module.exports = {
    window: undefined,
    open: function () {
        if (this.window !== undefined) {
            this.window.focus();
            return;
        }

        let windowSpecs = Display.getWindowSpecs(pageName);
        this.window = new BrowserWindow(
            Object.assign(windowSpecs, {
                title: pageName,
                webPreferences: {
                    preload: path.join(__dirname, './preload.js')
                }
            })
        );

        if (app.isPackaged) {
            this.window.loadFile(path.join(__dirname, `../../dist/${pageName}.html`));
        } else {
            this.window.loadURL(`http://localhost:${devServer.port}/${pageName}.html`);
        }

        this.window.once('ready-to-show', () => {
            this.window.show();
            this.window.webContents.openDevTools();
        });
    }
}