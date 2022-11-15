#!/usr/bin/env node

import { handle } from './handler'
import { program } from "commander";
import { configChain } from "./config";


async function main() {
  program
    .command('config')
    .option('-c | --chain <path>', 'default chain')
    .description('config')
    .action(configChain)
  program
    .command('get')
    .argument('address')
    .option('-p | --path <path>', 'Download path')
    .option('-c | --chain <chain>', 'chain node, eth, bsc etc. default as in config file')
    .option('-n | --name <name>', 'contract name, default as address')
    .description('')
    .action(handle)

  await program.parseAsync(process.argv)
}


// program.parse()
// const options = program.opts();
//
// if (!(program.args.length && program.args[0].startsWith('0x'))) {
//   console.log('Please input validate address. eg. 0x3432b6a60d23ca0dfca7761b7ab56459d9c964d0')
//   process.exit(0)
// }
// const contractAddress = program.args[0];
// const chain = options['chain'] || 'eth';
// const path = options['path'] || './contract';
// const name = options['name'] || '';

// const contract = new ContractHandler('./contract','0xdac17f958d2ee523a2206206994597c13d831ec7');
// const contract = new ContractHandler('./contract','0x3432b6a60d23ca0dfca7761b7ab56459d9c964d0');
// const contract = new ContractHandler('./contract','0xa3a7b6f88361f48403514059f1f16c8e78d60eec');
// handle(contractAddress, path, chain, name);

main().catch(err => {
  console.log(err)
})

