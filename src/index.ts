#!/usr/bin/env node

import { handle } from './handler'
import { program } from "commander";
import { configChain } from "./config";
import { installAlias } from "./installAlias";


async function main() {
  program
    .command('config')
    .option('-dc | --default-chain <defaultChain>', 'configure default chain')
    .option('-c | --chain <chain>', 'configure chain')
    .option('--reset', 'reset all config')
    .description('configure chain API')
    .action(configChain)
  program
    .command('get')
    .argument('address')
    .option('-p | --path <path>', 'Download path')
    .option('-c | --chain <chain>', 'chain node, eth, bsc etc. default as in config file')
    .option('-n | --name <name>', 'contract name, default as address')
    .description('')
    .action(handle)
  program
    .action(installAlias)

  await program.parseAsync(process.argv)
}
// 0xdac17f958d2ee523a2206206994597c13d831ec7
// 0x3432b6a60d23ca0dfca7761b7ab56459d9c964d0
// 0xa3a7b6f88361f48403514059f1f16c8e78d60eec

main().catch(err => {
  console.log(err)
})

