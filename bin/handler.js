"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handle = void 0;
const process = __importStar(require("process"));
const utils_1 = require("./utils");
function getContract(address, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const { url, apikey } = (0, utils_1.getConfig)(options);
        const res = yield (0, utils_1.getSourceCode)({
            url,
            address,
            apikey,
        }).then(res => res.data).catch(err => {
            console.log('Invalid url. Please check your configuration');
            process.exit(0);
        });
        if (res.status === 'NOTOK') {
            console.log(res.result);
            process.exit(0);
        }
        const result = res.result[0];
        const sourceCode = result.SourceCode;
        const contractName = result.ContractName;
        const path = options.path || '.';
        const folderName = options.name || address;
        writeContent(sourceCode, contractName, path, folderName);
        if (result.Proxy === '1') {
            console.log('Downloading proxy...');
            yield getContract(result.Implementation, Object.assign(Object.assign({}, options), { path: `${path}/${folderName}/proxy`, name: '' }));
        }
    });
}
function writeContent(sourceCode, contractName, path, folderName) {
    if (sourceCode.startsWith('{{')) {
        const parsedSourceCode = JSON.parse(sourceCode.slice(1, sourceCode.length - 1));
        (0, utils_1.writeFile)(JSON.stringify(parsedSourceCode.settings), 'settings.json', `${path}/${folderName}/${contractName}`);
        for (let key of Object.keys(parsedSourceCode.sources)) {
            (0, utils_1.writeFile)(parsedSourceCode.sources[key].content, key, `${path}/${folderName}/${contractName}`);
        }
    }
    else if (sourceCode.startsWith('{')) {
        const parsedSourceCode = JSON.parse(sourceCode);
        for (let key of Object.keys(parsedSourceCode)) {
            (0, utils_1.writeFile)(parsedSourceCode[key].content, key, `${path}/${folderName}`);
        }
    }
    else {
        (0, utils_1.writeFile)(sourceCode, `${contractName}.sol`, `${path}/${folderName}`);
    }
}
function handle(address, options) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!address.startsWith('0x')) {
            console.log('Invalid address');
            process.exit(0);
        }
        console.log('Downloading contract...');
        yield getContract(address, options);
        console.log(`Downloaded ${utils_1.fileNum} files in ${options.path || '.'}`);
        if (utils_1.fileNum === 0) {
            process.exit(0);
        }
        (0, utils_1.openWithVSCode)(options.path || '.');
    });
}
exports.handle = handle;
