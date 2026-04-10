import { contextBridge, ipcRenderer } from 'electron'

// 暴露给渲染进程的 API
contextBridge.exposeInMainWorld('electronAPI', {
  // 存档
  saveGame: (data: unknown) => ipcRenderer.invoke('save-game', data),
  loadGame: () => ipcRenderer.invoke('load-game'),
  
  // 配置
  getConfig: () => ipcRenderer.invoke('get-config'),
  setConfig: (config: unknown) => ipcRenderer.invoke('set-config', config),
  
  // 菜单事件监听
  onMenuNewGame: (callback: () => void) => {
    ipcRenderer.on('menu:new-game', callback)
    return () => ipcRenderer.removeListener('menu:new-game', callback)
  },
  onMenuSave: (callback: () => void) => {
    ipcRenderer.on('menu:save', callback)
    return () => ipcRenderer.removeListener('menu:save', callback)
  },
  onMenuLoad: (callback: () => void) => {
    ipcRenderer.on('menu:load', callback)
    return () => ipcRenderer.removeListener('menu:load', callback)
  },
})

// 类型声明
declare global {
  interface Window {
    electronAPI: {
      saveGame: (data: unknown) => Promise<{ success: boolean; error?: string }>
      loadGame: () => Promise<{ success: boolean; data?: unknown; error?: string }>
      getConfig: () => Promise<{ musicVolume: number; sfxVolume: number }>
      setConfig: (config: unknown) => Promise<{ success: boolean }>
      onMenuNewGame: (callback: () => void) => () => void
      onMenuSave: (callback: () => void) => () => void
      onMenuLoad: (callback: () => void) => () => void
    }
  }
}
