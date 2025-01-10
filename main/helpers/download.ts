/**********************************************************************
 *
 * @模块名称: download
 *
 * @模块作用: download
 *
 * @创建人: pgli
 *
 * @date: 2024/4/2 6:59 下午
 *
 * @版权所有: pgli
 *
 **********************************************************************/
import { DownloaderHelper } from "node-downloader-helper";
import fs from "fs";
import { throttle } from "@gaopeng123/utils.function";
import Store from 'electron-store';
import { basename, join } from "path";
import { sentWeb } from "./createEvents";
import { mockData } from "./mock";
import { isMac, log } from "../utils";
import download from "download";

const store = new Store();

const DL_MAP = new Map();

type DownloadFileParams = {
    filePath: string,
    folderPath: string,
    time?: string,
    maxConcurrencies?: number,
    action?: 'start' | 'stop' | 'pause' | 'resume', // 添加新的下载任务 删除任务  暂停任务 恢复下载
    children?: Array<DownloadFileParams>, // 批量下载处理整体进度
}

type DownloadFileEvents = {
    onEnd?: (v: any) => void,
    onError?: (v: any) => void,
    onStart?: (v: any) => void,
    onProgress?: (v: any) => void,
    onAction?: (v: any) => void,
    onMessage?: (v: any) => void,
}

type DownloadFileItem = {
    name?: string,
    progress?: number, // 进度
    type?: 'stop' | 'pause' | 'progress' | 'completed' | 'error', // 已删除 已暂停 正在下载 已完成 下载错误
} & DownloadFileParams

/**
 * 检查文件是否存在 不存在则创建
 * @param filePath
 */
export const checkFilePathAndCreate = (filePath: string) => {
    if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath, { recursive: true });
    }
}
export const downloadFileTasks = (params: DownloadFileParams, events: DownloadFileEvents) => {
    const { filePath, folderPath, time, action } = params;
    const { onStart, onProgress, onEnd, onMessage, onAction, onError } = events;
    // 当前文件是否存在 不存在则创建 防止报错
    checkFilePathAndCreate(folderPath);
    if (checkFile({ filePath, folderPath })) {
        onEnd({ filePath, folderPath, progress: 100, type: 'completed' });
    } else {
        download(filePath, folderPath).then((res) => {
            onEnd(res);
        }).catch(err => {
            log.error(err, filePath);
            onError(err);
        });
    }
}
export const downloadFileTask = (params: DownloadFileParams, events: DownloadFileEvents) => {
    const { filePath, folderPath, time, action } = params;
    const { onStart, onProgress, onEnd, onMessage, onAction, onError } = events;
    // 当前文件是否存在 不存在则创建 防止报错
    checkFilePathAndCreate(folderPath);
    const dlKey = `${filePath}-${folderPath}`;
    const dl = DL_MAP.get(dlKey) || new DownloaderHelper(filePath, folderPath, {
        resumeIfFileExists: true,
        removeOnStop: true
    });
    switch (action) {
        case "start":
            break
        case "pause":
            dl.pause();
            if (onAction) onAction({ ...params, action: 'pause', type: 'pause' });
            return;
        case "stop":
            dl.stop();
            // fs.unlink(join(folderPath, basename(filePath)), (error) => {
            //     if (error) {
            //         console.error('Failed to delete file:', error);
            //     } else {
            //         console.log('File deleted successfully');
            //     }
            // });
            if (onAction) onAction({ ...params, action: 'stop', type: 'stop' });
            return;
        case "resume":
            break
        default:
            break
    }
    // 检查文件是否已经被下载过 如果下载过 则恢复 如果不是 则重新恢复下载
    const _onEnd = () => {
        onEnd({ ...params, progress: 100, type: 'completed' })
    }
    if (checkFile({ filePath, folderPath })) {
        // 检查当前文件状态 如果已经下载完成了 则不在执行dl
        dl.getTotalSize().then((res) => {
            const stats = fs.statSync(join(folderPath, basename(filePath)));
            const fileSizeInBytes = stats.size;
            // 没有现在完成 则恢复下载
            if (res.total !== fileSizeInBytes) {
                dl.resume();
                if (onMessage) onMessage(`【${basename(filePath)}】已恢复下载，请在下载管理中查看`);
            } else {
                // #todo  发送消息给渲染进程 给出提示
                if (onMessage) onMessage(`【${basename(filePath)}】已存在，请在下载管理或【${folderPath}】中查看`);
                if (onEnd) {
                    _onEnd();
                }
            }
        });
    } else {
        dl.start().catch(err => {
            log.error(err, filePath);
            onError({ filePath, folderPath, type: 'error' });
        });
        if (onStart) onStart(params);
    }
    dl.on('error', (err) => {
        log.error('Download Failed', err, filePath);
        if (onError) {
            onError({ filePath, folderPath, type: 'error' });
        }
    });
    if (onProgress) {
        const _onProgress = throttle((v) => {
            onProgress({ filePath, folderPath, ...v, type: 'progress' });
        }, 200);
        dl.on('progress', _onProgress);
    }

    if (onEnd) {
        dl.on('end', _onEnd);
    }

    DL_MAP.set(dlKey, dl);
}
/**
 * 文件下载
 * @param filePath
 * @param folderPath
 */
export const downloadFile = (downloadFileParams: DownloadFileParams) => {
    const { filePath, folderPath, time, action } = downloadFileParams;
    downloadFileTask(downloadFileParams, {
        onStart: (startEvents) => {
            if (downloadFileParams.action !== 'resume') {
                setDownload({ ...startEvents, type: 'progress' });
            }
        },
        onProgress: (progressEvents) => {
            changeDownloadItem({ filePath, folderPath, ...progressEvents });
            sentListMessage();
        },
        onEnd: (endEvents) => {
            changeDownloadItem({ ...endEvents, progress: 100 });
            sentWeb('download-list', getDownloadList());
        },
        onMessage: (msg) => {
            sentWeb('download-message', {
                type: 'message',
                value: msg
            });
        },
        onAction: (actionEvents) => {
            changeDownloadItem({ ...actionEvents });
            sentWeb('download-list', getDownloadList());
        }
    });
}

/**
 * 批量文件下载
 */
export const downloadFiles = async (downloadFileParams: DownloadFileParams) => {
    const folderPath = downloadFileParams.folderPath;
    const maxConcurrencies = downloadFileParams.maxConcurrencies;
    const children: Array<DownloadFileItem> = false ? mockData.map((item) => {
        return {
            filePath: item,
            folderPath: folderPath
        }
    }) : downloadFileParams.children;

    setDownload({ ...downloadFileParams, type: 'progress' });

    const onEvents = (child, events, x: number, y: number) => {
        child.progress = 100;
        children[x * maxConcurrencies + y].progress = 100;
        sentListMessage(() => {
            const doneList = children.filter((item) => {
                return item.progress === 100;
            });
            const progress = doneList.length / children.length;
            changeDownloadItem({
                ...downloadFileParams,
                children: children,
                progress: progress * 100,
                type: progress === 100 ? 'completed' : 'progress'
            });
        });
    }

    /**
     * 分批次去下载 下载完成后再合并
     */
    const len = Math.ceil(children.length / maxConcurrencies);
    /**
     * 检查单批次下载是否已经完成
     * @param arr
     */
    const downloadSingleBatch = (arr, currentIndex) => {
        return new Promise((resolve, reject) => {
            for (let i = 0; i < arr.length; i++) {
                const child = arr[i];
                downloadFileTasks({ filePath: child.filePath, folderPath: child.folderPath }, {
                    onEnd: (endEvents) => {
                        onEvents(child, endEvents, currentIndex, i);
                    },
                    onError: (errorEvents) => {
                        onEvents(child, errorEvents, currentIndex, i);
                    },
                });
            }
            const checkLoop = () => {
                setTimeout(() => {
                    const noDone = arr.find((item) => {
                        return item.progress !== 100;
                    });
                    if (noDone) {
                        checkLoop();
                    } else {
                        resolve(true)
                    }
                }, 1000);
            }
            // 循环检测是否下载完成
            checkLoop();
        })
    }
    for (let i = 0; i < len; i++) {
        const batchArr = children.slice(i * maxConcurrencies, (i + 1) * maxConcurrencies);
        log.info(`开始下载第${i + 1}批, 长度为${batchArr.length}`);
        await downloadSingleBatch(batchArr, i);
    }
}

/**
 * 获取当前下载的文件列表
 */
export const getDownloadList = (): Array<DownloadFileItem> => {
    return (store.get('download-list') || []) as Array<DownloadFileItem>;
}

/**
 * 初始化当前的下载列表
 */
export const initDownloadList = () => {
    const list = getDownloadList();
    return list.map((item) => {
        return {
            ...item,
            type: item.children ? item.progress === 100 ? 'completed' : 'pause' : (checkFile(item) ? item.progress === 100 && item.type !== 'completed' ? 'completed' : 'pause' : 'stop'),
            name: item.name || basename(item.filePath)
        }
    });
}
/**
 * 发送消息  给渲染进程
 */
const sentListMessage = throttle((callBack) => {
    if (callBack) callBack();
    sentWeb('download-list', getDownloadList());
}, 2000, { type: 2, trailing: true });

export const setDownload = (current: DownloadFileItem) => {
    const list = getDownloadList();
    list.unshift(current);
    store.set('download-list', list);
    sentListMessage();
}
/**
 * 检查文件是否存在
 * @param item
 */
export const checkFile = (item: DownloadFileItem) => {
    const fileName = basename(item.filePath);
    return fs.existsSync(join(item.folderPath, fileName));
}

/**
 * 根据目录和文件名 来判断俩个文件是否一致
 * @param source
 * @param target
 */
export const isThisFile = (source: DownloadFileItem, target: DownloadFileItem) => {
    return source.filePath == target.filePath && source.folderPath && target.folderPath;
}
/**
 * 下载过程中修改进度 处理批量修改状态下的数据批量变化
 * @param item
 */
export const changeDownloadItem = (item: DownloadFileItem) => {
    const list = getDownloadList();
    const newList = list.map((listItem) => {
        return isThisFile(listItem, item) ? {
            ...listItem,
            ...item
        } : listItem
    });
    store.set('download-list', newList);
}
/**
 * 清空文件
 */
export const clearDownloadList = () => {
    store.set('download-list', []);
    sentWeb('download-list', []);
}