/**********************************************************************
 *
 * @模块名称: createUpdate
 *
 * @模块作用: createUpdate
 *
 * @创建人: pgli
 *
 * @date: 2024/3/22 3:07 下午
 *
 * @版权所有: pgli
 *
 **********************************************************************/
import { app, dialog, ipcMain } from 'electron';
import { autoUpdater, ProgressInfo } from "electron-updater"

// 通过main进程发送事件给renderer进程，提示更新信息
const sendUpdateMessage = (mainWindow, text) => {
    mainWindow.webContents.send('upgrade-message', text);
}
// 检测更新，在你想要检查更新的时候执行，renderer事件触发后的操作自行编写
export const updateHandle = (mainWindow) => {
    const message = {
        error: '检查更新出错',
        checking: '正在检查更新……',
        updateAva: '检测到新版本，正在下载……',
        updateNotAva: '现在使用的就是最新版本，不用更新',
    };

    autoUpdater.on('error', function (error) {
        sendUpdateMessage(mainWindow, {
            cmd: 'error',
            msg: message.error
        });
    });
    autoUpdater.on('checking-for-update', function () {
        sendUpdateMessage(mainWindow, {
            cmd: 'checking-for-update',
            msg: message.checking,
            process: process.cwd()
        });
    });
    autoUpdater.on('update-available', function (info) {
        sendUpdateMessage(mainWindow, {
            cmd: 'update-available',
            msg: message.updateAva
        });
    });

    autoUpdater.on('update-not-available', function (info) {
        sendUpdateMessage(mainWindow, {
            cmd: 'update-not-available',
            msg: message.updateNotAva
        });
    });

    // 更新下载进度事件
    autoUpdater.on('download-progress', (progressObj: ProgressInfo) => {
        // progressObj.downloadedFile = 'D:\\kemi\\'
        mainWindow.webContents.send('upgrade-download', progressObj)
    });
    // 下载成功回调
    autoUpdater.on('update-downloaded', (info) => {
        dialog.showMessageBox({
            type: 'info',
            title: '应用更新',
            message: '发现新版本，是否更新？',
            buttons: ['是', '否']
        }).then((buttonIndex) => {
            if (buttonIndex.response == 0) {  //选择是，则退出程序，安装新版本
                autoUpdater.quitAndInstall()
                app.quit()
            }
        })

        ipcMain.on('isUpdateNow', (e, arg) => {
                autoUpdater.quitAndInstall();
            }
        );
        mainWindow.webContents.send('isUpdateNow');
    });

    /**
     * 监听是否自动更新
     */
    ipcMain.on("checkForUpdate", () => {
            // 自己部署的地址
            const uploadUrl = 'http://8.140.172.215/package/';
            autoUpdater.setFeedURL(uploadUrl);
            //执行自动更新检查
            autoUpdater.checkForUpdates();
        }
    );
}