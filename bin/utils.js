"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteConfigFile = exports.isHasConfigFile = exports.writeConfig = exports.getAllConfig = exports.getConfig = exports.writeFile = exports.getSourceCode = exports.openWithVSCode = exports.fileNum = void 0;
const axios_1 = __importDefault(require("axios"));
const child_process_1 = __importDefault(require("child_process"));
const fs_1 = __importDefault(require("fs"));
const shelljs_1 = __importDefault(require("shelljs"));
exports.fileNum = 0;
const USER_HOME = process.env.HOME || process.env.USERPROFILE;
function openWithVSCode(path) {
    child_process_1.default.exec('which code', (err, sto) => {
        if (sto) {
            console.log('opening vscode');
            child_process_1.default.exec(`code ${path}`);
        }
        else {
            console.log('You have not installed vscode or you have not set code command.');
            console.log('Step 1: Install and open vscode.');
            console.log('Step 2: Press command + shift + P');
            console.log('Step 3: Type "install code" and choose the first option.');
        }
    });
}
exports.openWithVSCode = openWithVSCode;
const getSourceCode = ({ url, address, apikey, }) => {
    return axios_1.default.get(url, {
        params: {
            module: 'contract',
            action: 'getsourcecode',
            address,
            apikey,
        },
        timeout: 20000,
    });
};
exports.getSourceCode = getSourceCode;
function writeFile(data, fileName, dir = '') {
    const filePath = `${dir}/${fileName}`;
    const fileDir = filePath.split('/').slice(0, -1).join('/');
    const exists = fs_1.default.existsSync(fileDir);
    if (!exists) {
        fs_1.default.mkdirSync(fileDir, {
            recursive: true
        });
    }
    exports.fileNum += 1;
    fs_1.default.writeFile(filePath, data, { 'flag': 'w' }, err => {
        if (err) {
            throw (err);
        }
    });
}
exports.writeFile = writeFile;
function getConfig(options) {
    try {
        const parseData = (0, exports.getAllConfig)();
        const chain = options.chain || parseData.defaultChain || 'eth';
        const config = parseData.apiConfig.find(i => i.chain === chain);
        if (!config) {
            console.log('You have not configured this chain. Please uses `npx @wiw-io/vsopen-alias` to configure this chain');
            process.exit(0);
        }
        return {
            apikey: config.apikey,
            url: config.url,
        };
    }
    catch (e) {
        console.log('No config file. Please uses `npx @wiw-io/vsopen-alias` to generate a config file');
        process.exit(0);
    }
    return {
        url: '',
        apikey: '',
        chain: '',
    };
}
exports.getConfig = getConfig;
const getAllConfig = () => {
    const data = fs_1.default.readFileSync(`${USER_HOME}/.vsopen.json`, 'utf-8');
    return JSON.parse(data);
};
exports.getAllConfig = getAllConfig;
const writeConfig = (data) => {
    fs_1.default.writeFileSync(`${USER_HOME}/.vsopen.json`, JSON.stringify(data), { flag: 'w' });
};
exports.writeConfig = writeConfig;
const isHasConfigFile = () => {
    return shelljs_1.default.ls(`${USER_HOME}/.vsopen.json`).code === 0;
};
exports.isHasConfigFile = isHasConfigFile;
const deleteConfigFile = () => {
    return shelljs_1.default.rm('-rf', `${USER_HOME}/.vsopen.json`);
};
exports.deleteConfigFile = deleteConfigFile;
