// windows msi build script
const path = require('path')
const {MSICreator} = require('electron-wix-msi')
const packageJson = require('../package.json')

const BUILDDIR = path.join(__dirname, '..', 'dist');
const version = packageJson.version;
const PRODUCT_NAME = packageJson.productName
const setupIcon = path.join(__dirname, '..', 'resources', 'icon.ico')
const appDirectory = path.join(BUILDDIR, `win-unpacked`)
const outputDirectory = path.join(BUILDDIR, 'msi/win32-x64')


const creator = new MSICreator({
    appDirectory,
    outputDirectory,
    setupIcon,
    name: PRODUCT_NAME,
    setupExe: `${PRODUCT_NAME}.exe`,
    exe: PRODUCT_NAME
})

creator
    .create()
    .then(() => creator.compile())
    .then(() => {
        console.log('Windows msi build succeeded')
    })
    .catch(err => {
        console.error(err)
    })