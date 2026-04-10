import { app, BrowserWindow, ipcMain, Menu } from 'electron'
import path from 'path'
import { fileURLToPath } from 'url'
import Store from 'electron-store'

// 初始化存储
const store = new Store()

// 获取 __dirname 的 ESM 等效写法
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

let mainWindow: BrowserWindow | null = null

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1024,
    minHeight: 768,
    title: '关于负债不得不在地下城打工这件事',
    icon: path.join(__dirname, '../../build/icon.png'),
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    // 美化窗口
    titleBarStyle: 'hiddenInset',
    backgroundColor: '#1a1a2e',
    show: false, // 准备就绪后再显示
  })

  // 加载页面
  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL)
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(path.join(__dirname, '../../dist/index.html'))
  }

  // 准备就绪后显示窗口
  mainWindow.once('ready-to-show', () => {
    mainWindow?.show()
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

// 应用菜单
function createMenu() {
  const template: Electron.MenuItemConstructorOptions[] = [
    {
      label: '游戏',
      submenu: [
        {
          label: '新游戏',
          accelerator: 'CmdOrCtrl+N',
          click: () => {
            mainWindow?.webContents.send('menu:new-game')
          },
        },
        {
          label: '保存',
          accelerator: 'CmdOrCtrl+S',
          click: () => {
            mainWindow?.webContents.send('menu:save')
          },
        },
        {
          label: '加载',
          accelerator: 'CmdOrCtrl+O',
          click: () => {
            mainWindow?.webContents.send('menu:load')
          },
        },
        { type: 'separator' },
        {
          label: '退出',
          accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
          click: () => {
            app.quit()
          },
        },
      ],
    },
    {
      label: '视图',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
      ],
    },
  ]

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

// IPC 处理
function setupIPC() {
  // 存档
  ipcMain.handle('save-game', (_, data: unknown) => {
    try {
      store.set('save', data)
      return { success: true }
    } catch (error) {
      return { success: false, error: String(error) }
    }
  })

  // 读档
  ipcMain.handle('load-game', () => {
    try {
      const data = store.get('save')
      return { success: true, data }
    } catch (error) {
      return { success: false, error: String(error) }
    }
  })

  // 获取配置
  ipcMain.handle('get-config', () => {
    return {
      musicVolume: store.get('config.musicVolume', 0.5),
      sfxVolume: store.get('config.sfxVolume', 0.7),
    }
  })

  // 保存配置
  ipcMain.handle('set-config', (_, config) => {
    store.set('config', config)
    return { success: true }
  })
}

// 应用生命周期
app.whenReady().then(() => {
  createWindow()
  createMenu()
  setupIPC()

  app.on('activate', () => {
    if (mainWindow === null) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
