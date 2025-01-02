/**********************************************************************
 *
 * @模块名称: api
 *
 * @模块作用: api
 *
 * @创建人: pgli
 *
 * @date: 2024/4/9 7:13 下午
 *
 * @版权所有: pgli
 *
 **********************************************************************/
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Modal, message } from 'antd';
import { RcSuperLoading } from "@gaopeng123/rc-loading";
import { checkMsg, checkStatus, get } from "httpClient";
import styles from '@/styles/Report.module.scss';
import { getCurrentConfig } from 'store/dataStore';
import { downloadFiles, sentMessage } from 'utils';
import { formatTimestamp } from '@gaopeng123/utils';

const { confirm } = Modal;
// 所有表 总表  过杀 漏杀 规格内
export type ExportApiType = 'allTable' | 'summaryTable' | 'checkOverSum' | 'checkLessSum' | 'checkPassSum';

export enum ExportTypeMap {
    checkOverSum = 1,
    checkLessSum = 2,
    checkPassSum = 3,
    allTable = '所有表',
    summaryTable = '总表',
}

const openFolder = () => {
    confirm({
        icon: null,
        content: `下载完成，是否打开文件夹？`,
        onOk() {
            sentMessage('open-folder', { folderPath: getCurrentConfig().storagePath });
        },
    });
}

export const exportApi = async (type: ExportApiType) => {
    const modal = confirm({
        icon: null,
        content: <RcSuperLoading loading={true} duration={5000}>
            <div style={{ height: 400 }}></div>
        </RcSuperLoading>,
        className: styles.loadingModal,
    });
    get(`/spotCheck/info/export/${type}`).then((res) => {
        if (checkStatus(res)) {
            if (type === 'allTable' || type === 'summaryTable') {
                get('/spotCheck/pic/list').then((res) => {
                    if (res.pictureType === 'null') {
                        openFolder();
                        // 图片下载处理
                        modal.destroy();
                    } else {
                        setTimeout(() => {
                            // 图片下载处理
                            modal.destroy();
                            downloadFiles({
                                filePaths: `${formatTimestamp(Date.now())} ${ExportTypeMap[type]}`,
                                folderPath: getCurrentConfig().storagePath,
                                maxConcurrencies: 1000,
                                children: res.data?.map((item) => {
                                    return process.env.NODE_ENV === 'production' ? {
                                        folderPath: item.path,
                                        filePath: item.url,
                                    } : {
                                        folderPath: '/Users/wangxiangyu/Downloads/test/test',
                                        filePath: item.url.replace('http://127.0.0.1', 'http://10.88.223.30'),
                                    }
                                })
                            });
                            message.info('开始下载图片，请点击右上角下载图标查看');
                        }, 50)
                    }
                })
            } else {
                // 此处处理图片下载逻辑 下载完成 打开文件夹
                setTimeout(() => {
                    modal.destroy();
                    openFolder();
                }, 2000)
            }
        } else {
            modal.destroy();
            message.warning(checkMsg(res))
        }
    }).catch((error) => {
        modal.destroy();
        message.warning(error)
    });
}

/**
 * 导出日统计表
 * @param date
 */
export const exportDayStatistics = async (date: string) => {
    try {
        const res = await get(`/spotCheck/statistics/sum/export/${date}`);
        if (checkStatus(res)) {
            openFolder();
        } else {
            message.warning(checkMsg(res));
        }
    } catch (error) {
        message.warning(error)
    }
}


export const chartApi = async (date: string) => {
    try {
        const res = await get(`/spotCheck/statistics/sum/${date}`);
        if (checkStatus(res)) {
            return res.data;
        } else {
            message.warning(checkMsg(res));
            return {}
        }
    } catch (error) {
        message.warning(error)
    }
}
