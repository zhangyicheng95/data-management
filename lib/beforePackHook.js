const fs = require('fs');
const path = require('path');
// todo 执行时机不对 使用electronLanguages配置处理
module.exports = async function(context) {
    const appOutDir = context.appOutDir;
    const localesDir = path.join(appOutDir, 'locales');

    try {
        const files = fs.readdirSync(localesDir);
        for (const file of files) {
            if (!file.match(/^zh-CN\.pak$/)) { // 保留中文语言包，删除其他语言包
                fs.unlinkSync(path.join(localesDir, file));
            }
        }
    } catch (err) {
        console.error('Error occurred while removing unnecessary locales:', err);
    }
};