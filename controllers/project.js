const {
    ipcMain,
    dialog,
    BrowserWindow,
    Menu
} = require('electron');

const lang = require('../core/models/lang');

const Project = require('../models/project')
    , ProjectConfig =  require('../models/project-config')
    , Display = require('../models/display');

ipcMain.on("get-project-list", (event) => {
    event.returnValue = Project.list;
});

ipcMain.on("get-project-current-folksonomy", (event) => {
    if (Project.current === undefined) {
        event.returnValue = undefined;
        return;
    }
    event.returnValue = Project.getCurrent().folksonomy;
});

ipcMain.on("get-project-current-id", (event) => {
    event.returnValue = Project.current;
});

ipcMain.on("open-project", (event, index) => {
    if (Project.current !== undefined && Project.current === index) {
        require('../views/cosmoscope').open();
        return;
    }
    if (Project.list.has(index) === false) {
        event.returnValue = { isOk: false };
        dialog.showMessageBox(BrowserWindow.getFocusedWindow(), {
            title: lang.getFor(lang.i.dialog.project_no_exist.title),
            message: lang.getFor(lang.i.dialog.project_no_exist.message),
            type: 'info'
        });
    }

    try {
        Project.current = index;
        const unixDate = new Date().getTime() / 1000;
        Project.getCurrent().lastOpenDate = unixDate;
        const mainIsOpen = Display.getWindow('main') !== undefined;
        if (mainIsOpen) {
            require('../controllers/cosmoscope')(undefined, true);
        } else {
            require('../views/cosmoscope').open();
        }
        event.returnValue = { isOk: true };
    } catch (error) {
        event.returnValue = { isOk: false };
    }

    let windowForSend = Display.getWindow('export');
    if (windowForSend) {
        windowForSend.webContents.send("config-change");
    }
    windowForSend = Display.getWindow('record');
    if (windowForSend) {
        windowForSend.webContents.send("config-change");
    }
    windowForSend = Display.getWindow('history');
    if (windowForSend) {
        windowForSend.webContents.send("reset-history");
    }
    windowForSend = Display.getWindow('config');
    if (windowForSend) {
        windowForSend.webContents.send("reset-config");
    }
});

ipcMain.on("delete-project", (event, index) => {
    if (Project.list.has(index) === false) {
        dialog.showMessageBox(BrowserWindow.getFocusedWindow(), {
            title: lang.getFor(lang.i.dialog.project_no_exist.title),
            message: lang.getFor(lang.i.dialog.project_no_exist.message),
            type: 'info'
        });
        return;
    }

    Project.list.delete(index);
    event.reply('project-has-been-delete', index);
});

ipcMain.on("add-new-project", async (event, opts) => {
    for (const option of ['select_origin', 'files_origin', 'nodes_origin', 'links_origin', 'nodes_online', 'links_online']) {
        if (opts[option] === undefined) {
            throw new Error(`${option} option left for create a new project`);
        }
    }

    Project.current = undefined;
    const config = new ProjectConfig(opts);
    let isProjectWithValidOrigin = config.canModelizeFromDirectory() || config.canModelizeFromCsvFiles() || await config.canModelizeFromOnline();
    
    if (isProjectWithValidOrigin === false) {
        dialog.showMessageBox(BrowserWindow.getFocusedWindow(), {
            title: lang.getFor(lang.i.dialog.no_origin.title),
            message: lang.getFor(lang.i.dialog.no_origin.message),
            type: 'info'
        });
        return event.reply('new-project-result', { isOk: false });
    }

    switch (lang.flag) {
        case 'fr':
            config.opts.title = `Projet sans nom n°${Project.list.size + 1}`;
            break;
        case 'en':
            config.opts.title = `Unnamed project number ${Project.list.size + 1}`;
            break;
    }

    const unixDate = new Date().getTime() / 1000;
    const project = new Project(config.opts, undefined, new Map(), unixDate);
    const newProjectIndex = Project.add(project);
    Project.current = newProjectIndex;

    event.reply('new-project-result', { isOk: true });
    const mainIsOpen = Display.getWindow('main') !== undefined;
    let windowForSend = Display.getWindow('projects');
    if (windowForSend) {
        windowForSend.webContents.send('new-project-result', { isOk: true });
    }

    const appMenu = Menu.getApplicationMenu();
    appMenu.getMenuItemById('new-cosmoscope').enabled = isProjectWithValidOrigin;
    appMenu.getMenuItemById('export-cosmoscope').enabled = isProjectWithValidOrigin;
    appMenu.getMenuItemById('history').enabled = true;
    appMenu.getMenuItemById('options').enabled = true;
    appMenu.getMenuItemById('new-record').enabled = config.canSaveRecords();

    if (mainIsOpen) {
        require('../controllers/cosmoscope')();
    } else {
        require('../views/cosmoscope').open();
    }
});