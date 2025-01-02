/**********************************************************************
 *
 * @模块名称: themeConfig
 *
 * @模块作用: themeConfig
 *
 * @创建人: pgli
 *
 * @date: 2024/2/17 10:50 上午
 *
 * @版权所有: pgli
 *
 **********************************************************************/
import type { ThemeConfig } from 'antd';

const theme: ThemeConfig = {
    cssVar: true,
    // hashed: false, // 关闭 hash
    token: {
        motion: false, // 关闭动画 提高性能
        fontSize: 14,
        colorPrimary: '#3170FF',
        paddingLG: 16
    },
    components: {
        Tabs: {
            titleFontSize: 14,
            cardBg: '#ffffff',
        },
        Table: {
            rowSelectedBg: '#D8E6FF'
        },
        Tree: {
            directoryNodeSelectedBg: '#D8E6FF',
            directoryNodeSelectedColor: '#000000'
        },
        Modal: {
            motion: false, // 关闭动画 提高性能
        }
    },
};

export default theme;