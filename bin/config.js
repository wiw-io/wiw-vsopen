"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configChain = void 0;
const prompts_1 = __importDefault(require("prompts"));
const kolorist_1 = require("kolorist");
const utils_1 = require("./utils");
function setDefaultChain(chain) {
    const config = (0, utils_1.getAllConfig)();
    config.defaultChain = chain;
    (0, utils_1.writeConfig)(config);
    console.log(`Successfully set default chain to ${chain}`);
    console.log(`Use 'vsopen <address>' will automaticly use ${chain}`);
    process.exit(0);
}
function configChain(options) {
    return __awaiter(this, void 0, void 0, function* () {
        if (options.reset) {
            (0, utils_1.deleteConfigFile)();
            console.log('Config file has been deleted');
            process.exit(0);
        }
        const hasConfigFile = (0, utils_1.isHasConfigFile)();
        let config = {
            defaultChain: '',
            apiConfig: [],
        };
        if (hasConfigFile) {
            config = (0, utils_1.getAllConfig)();
            if (config.apiConfig.some(i => i.chain === options.defaultChain)) {
                setDefaultChain(options.defaultChain);
            }
            if (options.defaultChain) {
                // set chain which not exist in api config
                console.log('Invalid default chain');
                process.exit(1);
            }
            console.log('Refer on README.md');
        }
        let result;
        try {
            result = yield (0, prompts_1.default)([
                {
                    type: 'select',
                    name: 'type',
                    message: 'choose which one to config',
                    initial: 0,
                    choices: [
                        {
                            title: 'api url and key',
                            value: 'api',
                        },
                        ...(hasConfigFile ? [{
                                title: 'set default chain',
                                value: 'chain'
                            }] : [])
                    ],
                },
                {
                    type: (type) => type === 'api' ? 'text' : null,
                    name: 'chain',
                    message: (0, kolorist_1.cyan)('Input which chain to config api, such as `bsc`'),
                },
                {
                    type: (type) => type === 'chain' ? 'select' : null,
                    name: 'chain',
                    message: (0, kolorist_1.cyan)('Set default chain'),
                    initial: config.apiConfig.findIndex(i => i.chain === config.defaultChain),
                    choices: config.apiConfig.map(i => ({
                        title: i.chain,
                        value: i.chain,
                    }))
                },
                {
                    type: (_, selection) => {
                        if (selection.type === 'api' && config.apiConfig.some(i => i.chain === selection.chain)) {
                            const configBefore = config.apiConfig.find(i => i.chain === selection.chain);
                            console.log(`Chain: ${configBefore.chain}`);
                            console.log(`Url: ${configBefore.url}`);
                            console.log(`Apikey: ${configBefore.apikey}`);
                            return 'select';
                        }
                        return null;
                    },
                    name: 'isCancel',
                    message: (0, kolorist_1.cyan)('Current chain has been configured before, are you sure to overwrite the config above?'),
                    initial: false,
                    choices: [
                        { title: 'overwrite', value: false },
                        { title: 'cancel', value: true },
                    ]
                },
                {
                    type: (_, selection) => !selection.isCancel && selection.type === 'api' ? 'text' : null,
                    name: 'url',
                    message: 'Input api url',
                },
                {
                    type: (_, selection) => !selection.isCancel && selection.type === 'api' ? 'text' : null,
                    name: 'apikey',
                    message: 'Input apikey',
                }
            ], {
                onCancel: () => {
                    throw new Error((0, kolorist_1.red)('✖') + ' Operation cancelled');
                }
            });
        }
        catch (cancelled) {
            console.log(cancelled.message);
            return;
        }
        if (result.type === 'chain') {
            setDefaultChain(result.chain);
        }
        if (result.isCancel) {
            console.log('No change applied');
            process.exit(0);
        }
        const configChain = config.apiConfig.find(i => i.chain === result.chain);
        if (configChain) {
            configChain.apikey = result.apikey;
            configChain.url = result.url;
        }
        else {
            config.apiConfig.push({
                chain: result.chain,
                apikey: result.apikey,
                url: result.url
            });
            if (!config.defaultChain) {
                config.defaultChain = result.chain;
            }
        }
        (0, utils_1.writeConfig)(config);
        console.log(`Successfully configured ${result.chain}`);
        console.log(`Use 'vsopen get <address> -c ${result.chain}' to get contract source code`);
    });
}
exports.configChain = configChain;
