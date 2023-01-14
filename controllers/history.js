const {
    ipcMain,
    shell,
    dialog,
    BrowserWindow
} = require('electron');
const fs = require('fs/promises');

const Project = require('../models/project')
    , lang = require('../core/models/lang');

ipcMain.on("get-history-records", (event) => {
    event.returnValue = Project.getCurrent().history
});

ipcMain.on("history-action", (event, recordId, description, action) => {
    let result = true, path, record, report;

    switch (action) {
        case 'update':
            Project.getCurrent().history.get(recordId).description = description;
            resetHistoryWindow();
            break;

        case 'open-cosmoscope':
            path = Project.getCurrent().history.get(recordId).path;
            const { open: openCosmoscope } = require('../views/cosmoscope');
            const winCosmoscope = openCosmoscope();
            winCosmoscope.webContents.loadFile(path);
            break;

        case 'open-finder':
            path = Project.getCurrent().history.get(recordId).path;
            shell.showItemInFolder(path);
            break;

        case 'open-report':
            const pathReport = Project.getCurrent().history.get(recordId).pathReport;
            if (pathReport === undefined) {
                return;
            }

            const { open: openReport } = require('../views/report');
            const winReport = openReport();
            winReport.loadFile(pathReport);
            winReport.once('ready-to-show', () => winReport.show());
            break;

        case 'delete':
            path = Project.getCurrent().history.get(recordId).path;
            fs.rm(path).then(() => {
                Project.getCurrent().history.delete(recordId);
                resetHistoryWindow();
            }).catch(() => {
                return;
            })
            break;

        case 'delete-all':
            if (askDeleteAll() === true) {
                const paths = Array.from(Project.getCurrent().history.values()).map(({ path }) => path);
                Promise.all(paths.map(path => fs.rm(path)))
                    .then(() => {
                        Project.getCurrent().history = new Map();
                        resetHistoryWindow();
                    }).catch(() => {
                        return;
                    });
            }
            break;
    }

    function resetHistoryWindow() {
        const { win: winHistory } = require('../views/history');
        if (winHistory) {
            winHistory.webContents.send("reset-history");
        }
    }

});

/**
 * Ask user by a dialog modal to confirm delete_all
 * @returns {boolean} - True if the user answer 'Ok'
 */

function askDeleteAll () {
    const result = dialog.showMessageBoxSync(BrowserWindow.getFocusedWindow(), {
        message: lang.getFor(lang.i.dialog.delete_all.message),
        type: 'warning',
        buttons: [lang.getFor(lang.i.dialog.btn.cancel), lang.getFor(lang.i.dialog.btn.ok)],
        defaultId: 0,
        cancelId: 0,
        noLink: true
    })

    if (result === 1) { return true; }

    return false;
}