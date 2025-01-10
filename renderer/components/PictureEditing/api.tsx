/**********************************************************************
 *
 * @模块名称: api
 *
 * @模块作用: api
 *
 * @创建人: pgli
 *
 * @date: 2024/4/12 11:30 上午
 *
 * @版权所有: pgli
 *
 **********************************************************************/
import { checkStatus, post } from "httpClient";
import { dealWithParams } from "utils";
export const listApi = async (params) => {
    const res = await post('/spotCheck/list', {
        body: dealWithParams(params),
    });
    if (checkStatus(res)) {
        return {
            data: res.data.infoList,
            total: res.data.total
        }
    }
    return {
        data: [],
    }
}
/**
 * 标注状态接口
 * @param params
 */
// manualType： 过杀 漏杀 规格内 撤销
// manualInfo：id:0 撤销  id:1 OK 过杀 规格内； id:2 [NG]  漏杀
type UpdateParams = { barCode: string, manualType: 1 | 2 | 3 | 4, manualInfo: string }
export const updateApi = async (params: UpdateParams) => {
    const res = await post('/spotCheck/info/update', {
        body: params,
    });
    return res;
}

/**
 * 检测目标的ng信息
 * @param checkInfo
 * @param defectConfigList
 */
export const checkNgInfo = (val: { checkInfo: string, defectConfigList: any[] }) => {
    if (!val) {
        return []
    }
    const { checkInfo, defectConfigList } = val;
    return checkInfo?.split(";").filter(item => {
        const [key, value] = item.split(":");
        return value === "2";
    }).map((item) => {
        const [key, value] = item.split(":");
        const defectConfig = defectConfigList.find(item => item.id === Number(key));
        return defectConfig;
    });
}


// check_over：过杀
// check_less：漏杀
// check_pass：规格内

export const LabelColor = {
    checkOver: '#FFD800', // 过杀
    checkPass: '#50C818', // 规格内
    checkLess: '#00C0FF', // 漏杀
}

export const checkListKey = ['checkLess', 'checkOver', 'checkPass'];

export const checkList = (val, key: 'checkOver' | 'checkPass' | 'checkLess') => {
    if (!val) {
        return [];
    }
    const current = val[key];
    const defectConfigList = val.defectConfigList;
    if (!current) {
        return [];
    }
    return current?.split(";").map((item) => {
        const [key, value] = item.split(":");
        const defectConfig = defectConfigList.find(item => item.id === Number(key));
        return defectConfig;
    });
}