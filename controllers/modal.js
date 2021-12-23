const { ipcMain } = require('electron');

ipcMain.on("open-modal-typerecord", (event, recordType, action) => {
    require('../core/views/modal-typerecord')(recordType, action);
});

ipcMain.on("open-modal-typelink", (event, linkType, action) => {
    require('../core/views/modal-typelink')(linkType, action);
});

ipcMain.on("open-modal-view", (event, viewName, action) => {
    require('../core/views/modal-view')(viewName, action);
});

ipcMain.on("open-modal-historyrename", (event, recordId) => {
    require('../core/views/modal-historyrename')(recordId);
});