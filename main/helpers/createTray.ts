/**********************************************************************
 *
 * @模块名称: createTray
 *
 * @模块作用: createTray 创建托盘数据
 *
 * @创建人: pgli
 *
 * @date: 2024/3/21 6:37 下午
 *
 * @版权所有: pgli
 *
 **********************************************************************/

import { app, BrowserWindow, Menu, nativeImage, Notification, Tray } from 'electron'
import { join } from "path";
import { isMac } from "../utils";
import packageJson from "../../package.json"


export const createAppIcon = () => {
    const iconPath = join(__dirname, '../resources/icon.png')
    const icon = nativeImage.createFromPath(iconPath)
    icon.setTemplateImage(true);
    app.dock.setIcon(icon)
}

function winShow(win) {
    if (win.isVisible()) {
        if (win.isMinimized()) {
            win.restore()
            win.focus()
        } else {
            win.focus()
        }
    } else {
        !isMac && win.minimize()
        win.show()
        win.setSkipTaskbar(false)
    }
}

class createTrayFactory {
    private image: Electron.NativeImage;
    private count: number;
    private iconPath: string;
    private flickerTimer: NodeJS.Timeout;
    private tray: Tray;
    private win: BrowserWindow;
    private notification: Notification;

    constructor() {
        const iconType = isMac ? 'icon.png' : 'icon.ico'
        const icon = join(__dirname, '../resources', iconType)
        this.iconPath = icon;
        this.image = nativeImage.createFromPath(icon)
        this.count = 0
        this.flickerTimer = null
        if (isMac) {
            this.image.setTemplateImage(true)
        }
    }

    init(win) {
        // 设置应用栏图标
        createAppIcon();
        this.tray = new Tray(this.image);
        this.win = win;
        const contextMenu = Menu.buildFromTemplate([
            {
                label: packageJson.productName,
                click: () => {
                    winShow(win)
                }
            },
            // {
            //     label: '退出',
            //     click: () => {
            //         app.quit()
            //     }
            // }
        ])
        if (!isMac) {
            this.tray.on('click', () => {
                if (this.count !== 0) {
                    win.webContents.send('win-message-read') // 点击闪动托盘时通知渲染进程
                }
                winShow(win)
            })
            this.tray.setContextMenu(contextMenu)
        } else {
            new BrowserWindow({ show: false });
            app.dock.setMenu(contextMenu)
        }
        this.tray.setToolTip('通知')
    }

    flash({ flashFrame, messageConfig }) {
        this.win.flashFrame(flashFrame)
        if (isMac && messageConfig) { // mac设置未读消息数
            this.tray.setTitle(messageConfig.news === 0 ? '' : messageConfig.news + '')
            app.dock.setBadge(messageConfig.news === 0 ? '' : messageConfig.news + '')
        }
        if (messageConfig.news !== 0) { // 总消息数
            if (!this.flickerTimer && !isMac) { // win托盘闪动
                this.flickerTimer = setInterval(() => {
                    this.tray.setImage(this.count++ % 2 === 0 ? this.image : nativeImage.createFromPath(null))
                }, 500)
            }
            if (messageConfig.body) { // 消息Notification推送
                this.notification = new Notification(Object.assign({}, messageConfig)) //
                this.notification.once('click', () => {
                    winShow(this.win)
                    this.win.webContents.send('win-message-read', messageConfig.id)
                    this.notification.close()
                })
                this.notification.show()
            }
        } else { // 取消托盘闪动，还原托盘
            this.count = 0
            if (this.flickerTimer) {
                clearInterval(this.flickerTimer)
                this.flickerTimer = null
            }
            this.tray.setImage(this.image)
        }
    }
}

export const createTray = new createTrayFactory();