const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  getConfigOptions: () => ipcRenderer.sendSync('get-config-options'),
});
