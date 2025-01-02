/**********************************************************************
 *
 * @模块名称: Store
 *
 * @模块用途: data Store 状态管理
 *
 * @创建人: wangxiangyu
 *
 * @date: 2024-03-28 11:05:19
 *
 **********************************************************************/
import { isEmpty } from '@gaopeng123/utils';
import { checkStatus, get as httpGet } from 'httpClient';
import {
    RecoilRoot,
    atom,
    selector,
    useRecoilState,
    useRecoilValue,
} from 'recoil';

/**
 * 图片操作处理状态管理
 */
type PictureEditingSelectedStateType = {
    table?: any,
    tree?: any,
    hasColor?: boolean,
    image?: 'originPic' | 'detectPic',
    refreshKey?: number
}

export const PictureEditingSelectedState = atom<PictureEditingSelectedStateType>({
    key: 'pictureEditing-selected',
    default: {
        image: 'originPic', // 原图或检测图    originPic | detectPic
        hasColor: false, // 是否有颜色
        table: null, // 表格数据
        tree: null, // 树形数据
        refreshKey: null, // 刷新标识
    }, // ccdInfoList
});

/**
 * 全局操作记录管理 主要用于通知其他页面刷新
 */
export type ActionRecordTypeCurrent = 'CheckData' | 'PictureEditing' | 'Report' | 'ParamsSetting';
export type ActionRecordType = {
    currentSelected: ActionRecordTypeCurrent,
    action: 'add' | 'del' | 'edit' | null,
    note: string,
    refreshKey?: number
};
export const ActionState = atom<ActionRecordType>({
    key: 'action-state',
    default: {
        currentSelected: 'CheckData',
        action: null,
        note: '',
        refreshKey: null, // 强制刷新
    },
});

/**
 * 全局配置管理
 */
export type CurrentConfigStateType = {
    defectSplit: string,
    URL?: string;
    storagePath?: string;
    pictureType?: string;
    client_Id?: string;
    client_Secret?: string;
};

export const setCurrentConfig = (setConfig: any, config: CurrentConfigStateType) => {
    sessionStorage.setItem('ConfigState', JSON.stringify(config));
    setConfig(config)
}

export const getCurrentConfig = () => {
    return JSON.parse(sessionStorage.getItem('ConfigState') || '{}') as CurrentConfigStateType;
}
export const CurrentConfigState = atom<CurrentConfigStateType>({
    key: 'ConfigState',
    default: selector({
        key: "ConfigState/Default",
        get: async ({ get }) => {
            const res: any = await httpGet('/parameter/get');
            if (checkStatus(res)) {
                const defaultData = {};
                res?.data?.forEach((item) => {
                    defaultData[item.name] = item.value;
                });
                sessionStorage.setItem('ConfigState', JSON.stringify(defaultData));
                return defaultData as CurrentConfigStateType;
            } else {
                return {} as CurrentConfigStateType;
            }
        },
    }),
});
