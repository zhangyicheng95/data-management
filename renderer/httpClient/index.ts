/**********************************************************************
 *
 * @模块名称: fetch
 *
 * @模块作用: fetch
 *
 * @创建人: pgli
 *
 * @date: 2024/3/27 4:42 下午
 *
 * @版权所有: pgli
 *
 **********************************************************************/
import { register } from '@gaopeng123/fetch';
import { message } from 'antd';

export { get as get } from "@gaopeng123/fetch";
export { post as post } from "@gaopeng123/fetch";
export { put as put } from "@gaopeng123/fetch";
export { del as del } from "@gaopeng123/fetch";
export { patch as patch } from "@gaopeng123/fetch";

export const checkStatus = (res: any) => res.code === 200 || res.status === 200;

export const checkMsg = (res: any) => res.msg || res.message || res.result;

export const checkUlr = (url)=> {
    return url.startsWith('http') ? url : process.env.NEXTRON_SERVER_BASE + url
}
const intercept = {
    request: function (url: string, config) {
        // Modify the url or config here
        // config.headers.token = 'tttt';
        return [checkUlr(url), config];
    },

    requestError: function (error: Error) {
        return Promise.reject(error);
    },

    response: async function (response: Response) {
        // Modify the reponse object
        // resolve(response);
        // or
        return new Promise((resolve, reject) => {
            resolve(response);
        });
    },

    responseError: function (error: Error) {
        // Handle an fetch error
        message.destroy();
        message.error('网络连接失败，请检查网络设置后点击【工具->重新加载】');
        return Promise.reject(error);
    }
};
// unregisterFetch 卸载拦截器 在app卸载时调用下 卸载掉
export const unregisterFetch = register(intercept);