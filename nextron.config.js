const getMode = () => {
    if (process.env.NEXTRON_MODE === 'production') {
        return {
            devtool: false,
            mode: 'production'
        }
    } else {
        return {
            devtool: "eval-source-map",
            mode: 'development'
        }
    }
}

module.exports = {
    getMode: getMode,
    webpack: (config, options) => {
        const {devtool, mode} = getMode()
        config.devtool = devtool;
        config.mode = mode;
        return config
    },
};