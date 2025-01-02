import path from 'path'
import { app, BrowserWindow, ipcMain, Menu } from 'electron'
import serve from 'electron-serve'
import { createMessageEvents, createWindow, createMenus, updateHandle } from './helpers'
import { isProd } from './utils'

if (isProd) {
    serve({ directory: 'app' })
} else {
    app.setPath('userData', `${app.getPath('userData')} (development)`)
}

let mainWindow: BrowserWindow | null = null
;(async () => {
    // 保持单例
    const shouldQuit = app.requestSingleInstanceLock()

    if (!shouldQuit) {
        app.quit();
        return;
    }

    // 设置语言包
    app.commandLine.appendSwitch('lang', 'zh-CN');

    await app.whenReady()

    mainWindow = createWindow('main', {
        width: 1288,
        height: 720,
        minWidth: 1288, // 设置最小宽度
        minHeight: 720, // 设置最小高度
        webPreferences: {
            nodeIntegration: true, // 注入node模块
            contextIsolation: true, // 渲染进程是否可使用require
            preload: path.join(__dirname, 'preload.js'),
        },
    });

    if (isProd) {
        await mainWindow.loadURL('app://./index')
        // mainWindow.webContents.openDevTools();
    } else {
        const port = process.argv[2]
        await mainWindow.loadURL(`http://localhost:${port}/`)
        mainWindow.webContents.openDevTools()
    }
    // 设置默认菜单
    createMenus(mainWindow)
    // 自动升级检测
    updateHandle(mainWindow);
    // 设置消息通知
    // createTray.init(mainWindow);
    // 注入消息通知
    createMessageEvents(mainWindow);
})();

app.on('window-all-closed', () => {
    app.quit()
})
// 当运行第二个实例时,将会聚焦到mainWindow这个窗口
app.on('second-instance', (event, commandLine, workingDirectory) => {
    if (mainWindow) {
        if (mainWindow.isMinimized()) mainWindow.restore()
        mainWindow.focus()
        mainWindow.show()
    }
});


ipcMain.on('message', async (event, arg) => {
    event.reply('message', `${arg} World!`)
})
