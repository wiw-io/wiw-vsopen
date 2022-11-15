import * as process from "process";
import { IContractResult, IOptions } from './types'
import { getSourceCode, openWithVSCode, writeFile, fileNum, getConfig } from "./utils";
import { installAlias } from "./installAlias";

async function getContract(address: string, options: IOptions) {
  const {url, apikey} = getConfig(options);
  const res = await getSourceCode({
    url,
    address,
    apikey,
  }).then(res => res.data)
  console.log(res)
  if (res.status === 'NOTOK') {
    console.log(res.result);
    process.exit(0)
  }
  const result = res.result[0] as IContractResult;
  const sourceCode = result.SourceCode
  const contractName = result.ContractName

  const path = options.path || '.'
  const folderName = options.name || address
  writeContent(sourceCode, contractName, path, folderName)
  if (result.Proxy === '1') {
    console.log('Downloading proxy...')
    await getContract(result.Implementation, {
      ...options,
      path: `${path}/${folderName}/proxy`,
      name: '',
    })
  }
}

function writeContent (sourceCode: string, contractName: string, path: string, folderName: string) {
  if (sourceCode.startsWith('{{')) {
    const parsedSourceCode = JSON.parse(sourceCode.slice(1, sourceCode.length - 1))
    writeFile(JSON.stringify(parsedSourceCode.settings), 'settings.json', `${path}/${folderName}/${contractName}`)
    for (let key of Object.keys(parsedSourceCode.sources)) {
      writeFile(parsedSourceCode.sources[key].content, key, `${path}/${folderName}/${contractName}`)
    }
  } else if (sourceCode.startsWith('{')) {
    const parsedSourceCode = JSON.parse(sourceCode)
    for (let key of Object.keys(parsedSourceCode)) {
      writeFile(parsedSourceCode[key].content, key, `${path}/${folderName}`)
    }
  } else {
    writeFile(sourceCode, `${contractName}.sol`, `${path}/${folderName}`);
  }
}

export async function handle(address: string, options: IOptions) {
  installAlias();
  if (!address.startsWith('0x')) {
    console.log('Invalid address');
    process.exit(0)
  }
  console.log('Downloading contract...')
  await getContract(address, options)
  console.log(`Downloaded ${fileNum} files in ${options.path || '.'}`)
  if (fileNum === 0) {
    process.exit(0);
  }
  openWithVSCode(options.path || '.');
}
