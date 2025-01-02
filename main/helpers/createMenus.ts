/**********************************************************************
 *
 * @模块名称: createMenus
 *
 * @模块作用: createMenus
 *
 * @创建人: pgli
 *
 * @date: 2024/4/10 9:16 上午
 *
 * @版权所有: pgli
 *
 **********************************************************************/
import { app, BrowserWindow, dialog, Menu } from "electron";
import { isProd, winShow } from "../utils";
import packageJson from "../../package.json"

export const createMenus = (mainWindow: BrowserWindow) => {
    // 设置默认菜单
    Menu.setApplicationMenu(Menu.buildFromTemplate([
        {
            label: '帮助',
            submenu: [
                {
                    label: '关于',
                    click: () => {
                        const appVersion = app.getVersion();
                        dialog.showMessageBox(mainWindow, {
                            type: 'info',
                            title: '关于',
                            message: `当前版本：${appVersion}`,
                            buttons: ['知道了']
                        });
                    }
                },
                { type: 'separator' },
                { label: '关闭', accelerator: 'CmdOrCtrl+Q', role: 'quit' }
            ]
        },
        {
            label: '工具',
            submenu: [
                {
                    label: '放大',
                    accelerator: 'CmdOrCtrl+Plus',
                    role: 'zoomIn'
                },
                {
                    label: '缩小',
                    accelerator: 'CmdOrCtrl+-',
                    role: 'zoomOut'
                },
                {
                    label: '恢复默认',
                    accelerator: 'CmdOrCtrl+O',
                    role: 'resetZoom'
                },
                { type: 'separator' },
                {
                    label: '复制',
                    accelerator: 'CmdOrCtrl+C',
                    role: 'copy'
                },
                {
                    label: '剪切',
                    accelerator: 'CmdOrCtrl+X',
                    role: 'cut'
                },
                {
                    label: '粘贴',
                    accelerator: 'CmdOrCtrl+V',
                    role: 'paste'
                },
                { type: 'separator' },
                {
                    label: '开发者工具',
                    accelerator: 'CmdOrCtrl+Shift+I',
                    role: 'toggleDevTools'
                },
                { type: 'separator' },
                {
                    label: '刷新',
                    accelerator: 'CmdOrCtrl+R',
                    role: 'forceReload'
                },
            ]
        }
    ]));
    // 处理关闭逻辑
    app.on('quit', () => {
        // @ts-ignore 重置 isQuitting 标志位
        app.__isQuitting = false;
    });

    // 当应用程序准备退出时，设置标志位
    app.on('before-quit', () => {
        // @ts-ignore
        app.__isQuitting = true;
    });

    // 监听窗口关闭事件
    mainWindow.on('close', (event) => {
        // @ts-ignore 阻止默认关闭行为 最小化窗口到系统托盘
        // if (isProd && !app.__isQuitting) {
        //     event.preventDefault();
        //     mainWindow.minimize();
        // }
    });

    // const contextMenu = Menu.buildFromTemplate([
    //     {
    //         label: packageJson.productName,
    //         click: () => {
    //             winShow(mainWindow)
    //         }
    //     },
    //     {
    //         label: '关闭',
    //         click: () => {
    //             // @ts-ignore
    //             app.__isQuitting = false;
    //             app.quit()
    //         }
    //     }
    // ]);
    // // 添加系统托盘
    // app.dock.setMenu(contextMenu)
}