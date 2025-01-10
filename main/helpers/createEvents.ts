/**********************************************************************
 *
 * @模块名称: createEvents
 *
 * @模块作用: createEvents
 *
 * @创建人: pgli
 *
 * @date: 2024/3/22 11:33 上午
 *
 * @版权所有: pgli
 *
 **********************************************************************/
import { createTray } from "./createTray";
import { BrowserWindow, dialog, ipcMain, shell, WebContents } from "electron";
import { clearDownloadList, downloadFile, downloadFiles, initDownloadList } from "./download";
import { isMac, log } from "../utils";

/**
 * 给渲染进程发送消息
 * @param key
 * @param message
 */
let mainWindow;
export const getCurrentWindow = () => {
    return BrowserWindow.getFocusedWindow() || mainWindow;
}

export const getWebContents = (): WebContents => {
    return getCurrentWindow().webContents;
}

export const sentWeb = (key: string, message) => {
    getWebContents().send(key, message);
}


// 测试消息通知
//  setInterval(()=> {
//    createTray.flash({
//      flashFrame: false,
//      messageConfig: {
//        news: Math.random() * 100,
//        title: 'Notification Title',
//        body: 'Notification Body',
//      }
//    })
//  }, 5000)


export const createMessageEvents = (_mainWindow) => {
    mainWindow = _mainWindow;
    ipcMain.on('message', (ipcEvent, messageInfo) => {
        createTray.flash({
            flashFrame: false,
            messageConfig: messageInfo
        })
    });
    /**
     * a标签下载
     */
    ipcMain.on('aDownload', (ipcEvent, messageInfo: { filePath: string, fileName: string }) => {
        // shell.openExternal(messageInfo.filePath)
        // getWebContents().downloadURL(messageInfo.filePath);
        const folderPath = '/Users/wangxiangyu/Downloads/test/test';
        downloadFile({ ...messageInfo, folderPath: folderPath })
        // download(mainWindow, messageInfo.filePath, {
        //     openFolderWhenDone: true,
        //     saveAs: true,
        //     onStarted: (handle) => {
        //         console.log('new-version-download-started');
        //     },
        //     onProgress: (progress) => {
        //         console.log(progress)
        //         if (progress.percent === 1) {
        //             console.log('new-version-download-finished');
        //         }
        //     }
        // })
    });

    ipcMain.on('aDownloadList', (ipcEvent, messageInfo: { filePath: string, fileName: string, folderPath: string, maxConcurrencies: number }) => {
        // shell.openExternal(messageInfo.filePath)
        // getWebContents().downloadURL(messageInfo.filePath);
        const folderPath = '/Users/wangxiangyu/Downloads/test1';
        downloadFiles({ ...messageInfo, folderPath: isMac ? folderPath : messageInfo.folderPath });
        // download(mainWindow, messageInfo.filePath, {
        //     openFolderWhenDone: true,
        //     saveAs: true,
        //     onStarted: (handle) => {
        //         console.log('new-version-download-started');
        //     },
        //     onProgress: (progress) => {
        //         console.log(progress)
        //         if (progress.percent === 1) {
        //             console.log('new-version-download-finished');
        //         }
        //     }
        // })
    });

    // getWebContents().session.on('will-download', (e, item) => {
    //     const filePath = join(app.getPath('downloads'), item.getFilename());
    //     //监听下载过程，计算并设置进度条进度
    //     item.on('updated', (evt, state) => {
    //         if ('progressing' === state) {
    //             //此处  用接收到的字节数和总字节数求一个比例  就是进度百分比
    //             let value = 0;
    //             if (item.getReceivedBytes() && item.getTotalBytes()) {
    //                 value = item.getReceivedBytes() / item.getTotalBytes();
    //             }
    //             console.log('value-----------', value)
    //             // 把百分比发给渲染进程进行展示
    //             sentWeb('updateProgressing', value);
    //             // // mac 程序坞、windows 任务栏显示进度
    //             getCurrentWindow().setProgressBar(value);
    //         }
    //     })
    //     //监听下载结束事件
    //     item.on('done', (e, state) => {
    //         //如果窗口还在的话，去掉进度条
    //         if (!getCurrentWindow().isDestroyed()) {
    //             getCurrentWindow().setProgressBar(-1)
    //         }
    //         //下载被取消或中断了
    //         if (state === 'interrupted') {
    //             dialog.showErrorBox(
    //                 '下载失败',
    //                 `文件 ${item.getFilename()} 因为某些原因被中断下载`
    //             )
    //         }
    //         // 下载成功后打开文件所在文件夹
    //         if (state === 'completed') {
    //             setTimeout(() => {
    //                 shell.showItemInFolder(filePath)
    //             }, 1000)
    //         }
    //     })
    // })

    ipcMain.on('download-list', (ipcEvent, { type }) => {
        if (type === 'initDownloadList') {
            ipcEvent.sender.send('download-list', initDownloadList());
        }
    });
    /**
     * 文件清理
     */
    ipcMain.on('clear-download-list', (ipcEvent, { type }) => {
        clearDownloadList();
    });


    // 监听选择文件夹按钮点击事件
    ipcMain.on('select-folder', async (event) => {
        const result = await dialog.showOpenDialog({
            properties: ['openDirectory']
        });

        // 发送选择的文件夹路径给渲染进程
        event.sender.send('folder-selected', result.filePaths);
    });

    /**
     * 打开菜单文件夹
     */
    ipcMain.on('open-folder', async (event, messageInfo: { folderPath: string }) => {
        shell.openPath(messageInfo.folderPath)
            .then(() => console.log('Folder opened successfully:', messageInfo.folderPath))
            .catch((error) => console.log('Error opening folder:', error));
    });
    /**
     * 记录log
     */
    ipcMain.on('log', async (event, messageInfo: { type: 'error' | 'warn' | 'info' | 'debug', data: any }) => {
        if (log[messageInfo.type]) {
            log[messageInfo.type](JSON.stringify(messageInfo.data));
        } else {
            log.warn(`log函数不支持【${messageInfo.type}】`);
        }
    });
}