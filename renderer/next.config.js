const path = require('path');
const {getMode} = require('../nextron.config');

/**
 * 注入环境变量
 * @returns {{}}
 */
const getEnv = () => {
    const env = {}; // NEXTRON
    for (const envKey in process.env) {
        if (envKey.startsWith('NEXTRON')) {
            env[envKey] = process.env[envKey];
        }
    }
    return env;
}

module.exports = {
    env: getEnv(),
    sassOptions: {
        includePaths: [path.join(__dirname, 'styles')],
    },
    trailingSlash: true,
    images: {
        unoptimized: true,
    },
    eslint: {
        noUnusedImports: false
    },
    webpack: (config, options) => {
        config.resolve.alias = {
            ...config.resolve.alias,
            '@': path.resolve(__dirname, './'),
        }
        const {devtool, mode} = getMode();
        config.devtool = devtool;
        config.mode = mode;
        return config
    },
}