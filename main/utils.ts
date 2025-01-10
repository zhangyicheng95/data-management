/**********************************************************************
 *
 * @模块名称: utils
 *
 * @模块作用: utils
 *
 * @创建人: pgli
 *
 * @date: 2024/3/22 10:20 上午
 *
 * @版权所有: pgli
 *
 **********************************************************************/
import _log from 'electron-log/main';
export const isMac = process.platform === 'darwin';
export const isProd = process.env.NODE_ENV === 'production'

export function winShow(win) {
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
export const log = isProd ? _log : console;