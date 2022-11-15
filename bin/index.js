#!/usr/bin/env node
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
Object.defineProperty(exports, "__esModule", { value: true });
const handler_1 = require("./handler");
const commander_1 = require("commander");
const config_1 = require("./config");
const installAlias_1 = require("./installAlias");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        commander_1.program
            .command('config')
            .option('-dc | --default-chain <defaultChain>', 'configure default chain')
            .option('-c | --chain <chain>', 'configure chain')
            .option('--reset', 'reset all config')
            .description('configure chain API')
            .action(config_1.configChain);
        commander_1.program
            .command('get')
            .argument('address')
            .option('-p | --path <path>', 'Download path')
            .option('-c | --chain <chain>', 'chain node, eth, bsc etc. default as in config file')
            .option('-n | --name <name>', 'contract name, default as address')
            .description('')
            .action(handler_1.handle);
        commander_1.program
            .action(installAlias_1.installAlias);
        yield commander_1.program.parseAsync(process.argv);
    });
}
// 0xdac17f958d2ee523a2206206994597c13d831ec7
// 0x3432b6a60d23ca0dfca7761b7ab56459d9c964d0
// 0xa3a7b6f88361f48403514059f1f16c8e78d60eec
main().catch(err => {
    console.log(err);
});
