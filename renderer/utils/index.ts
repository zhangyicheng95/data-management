/**********************************************************************
 *
 * @模块名称: index
 *
 * @模块作用: index
 *
 * @创建人: pgli
 *
 * @date: 2024/4/2 2:46 下午
 *
 * @版权所有: pgli
 *
 **********************************************************************/
import { formatTimestamp, makeParamsProper, randomInt } from "@gaopeng123/utils";

/**
 * 处理表格参数
 * @param params
 * @param pageOptions
 */
export const dealWithParams = (params: any, pageOptions?: any) => {
    const { pageNumKey, pageSizeKey } = Object.assign({ pageNumKey: 'pageNum', pageSizeKey: 'pageSize' }, pageOptions);
    const newParams = makeParamsProper(params);
    newParams[pageNumKey] = newParams.current;
    newParams[pageSizeKey] = newParams.pageSize;
    // 删除冗余参数
    if (pageNumKey !== 'current') {
        delete newParams.current;
    }
    if (pageSizeKey !== 'pageSize') {
        delete newParams.pageSize;
    }
    return newParams;
};

/**
 * 文件下载
 * @param filePath
 * @param folderPath
 */
export const downloadFile = ({
                                 filePath,
                                 folderPath,
                                 time
                             }: { filePath: string, folderPath: string, time?: number }) => {
    const mock = ['https://ubsense-iot-1254375538.cos.ap-beijing.myqcloud.com/ub-web/browser/chrome/116.0.5845.97_chrome_installer.exe',
        'https://ubsense-iot-1254375538.cos.ap-beijing.myqcloud.com/ub-web/browser/chrome/chrome_116_64.msi',
        'https://ubsense-iot-1254375538.cos.ap-beijing.myqcloud.com/ub-web/apk-test/weigh_latest_10.apk',
        'https://ubsense-iot-1254375538.cos.ap-beijing.myqcloud.com/ub-web/apk-test/weigh_latest_12.apk',
    ]
    window?.ipc?.send('aDownload', {
        filePath: mock[randomInt(0, 3)],
        fileName: 'Notification Title',
    })
}
/**
 * 数据清理
 */
export const clearDownloadList = () => {
    window?.ipc?.send('clear-download-list', {});
}
/**
 * 图片批量下载
 * @param filePaths
 * @param folderPath
 * @param children
 */
export const downloadFiles = ({ filePaths, folderPath, maxConcurrencies, children }) => {
    window?.ipc?.send('aDownloadList', {
        name: `${filePaths}`,
        filePath: filePaths,
        time: Date.now(),
        folderPath: folderPath,
        maxConcurrencies: maxConcurrencies,
        children: children
    });
}
/**
 * 发送消息给主进程
 * @param key
 * @param message
 */
export const sentMessage = (key: string, message: unknown) => {
    window?.ipc?.send(key, message);
}
/**
 * 监听主进程消息
 * @param key
 * @param handle
 */
export const onMain = (key: string, handle: (v: unknown) => void) => {
    window.ipc?.on(key, handle);
}

export const checkType = (val) => {
    switch (val) {
        case 1:
            return 'OK';
        case 2:
            return 'NG';
        default:
            return null;
    }
}

export const isWeb = () => {
    // // @ts-ignore
    if (window.ipc) {
        // @ts-ignore 预留调试入口
        window.__electronClear = clearDownloadList;
    }
    // // @ts-ignore
    return !window.ipc;
};