import { contextBridge, ipcRenderer } from "electron";
contextBridge.exposeInMainWorld("electronAPI", {
  // 存档
  saveGame: (data) => ipcRenderer.invoke("save-game", data),
  loadGame: () => ipcRenderer.invoke("load-game"),
  // 配置
  getConfig: () => ipcRenderer.invoke("get-config"),
  setConfig: (config) => ipcRenderer.invoke("set-config", config),
  // 菜单事件监听
  onMenuNewGame: (callback) => {
    ipcRenderer.on("menu:new-game", callback);
    return () => ipcRenderer.removeListener("menu:new-game", callback);
  },
  onMenuSave: (callback) => {
    ipcRenderer.on("menu:save", callback);
    return () => ipcRenderer.removeListener("menu:save", callback);
  },
  onMenuLoad: (callback) => {
    ipcRenderer.on("menu:load", callback);
    return () => ipcRenderer.removeListener("menu:load", callback);
  }
});
//# sourceMappingURL=index.js.map
on.ipcRenderer.removeListener("menu:load", callback);
  }
});
//# sourceMappingURL=index.js.map
