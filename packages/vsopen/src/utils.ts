import axios from "axios";
import child from 'child_process'
import { IApiResponse, IGetSourceCodeProps, IOptions, IConfig } from "./types";
import fs from "fs";

export let fileNum = 0;

export function openWithVSCode (path: string) {
  child.exec('which code', (err, sto) => {
    if (sto) {
      console.log('opening vscode');
      child.exec(`code ${path}`)
    } else {
      console.log('You have not installed vscode or you have not set code command.')
      console.log('Step 1: Install and open vscode.')
      console.log('Step 2: Press command + shift + P')
      console.log('Step 3: Type "install code command" and choose the first option.')
    }
  });
}

export const getSourceCode = ({
  url,
  address,
  apikey,
}: IGetSourceCodeProps) => {
  return axios.get<IApiResponse>(url, {
    params: {
      module: 'contract',
      action: 'getsourcecode',
      address,
      apikey,
    },
  })
}

export function writeFile(data: string, fileName: string, dir = '') {
  const filePath = `${dir}/${fileName}`
  const fileDir = filePath.split('/').slice(0, -1).join('/')
  const exists = fs.existsSync(fileDir);
  if (!exists) {
    fs.mkdirSync(fileDir, {
      recursive: true
    })
  }
  fileNum += 1;
  fs.writeFile(filePath, data, { 'flag': 'w' }, err => {
    if (err) {
      throw (err)
    }
  })
}

export function getConfig(options: IOptions) {
  const USER_HOME = process.env.HOME || process.env.USERPROFILE
  try {
    const data = fs.readFileSync(`${USER_HOME}/.vsopen.json`, 'utf-8');
    const parseData: IConfig = JSON.parse(data);
    const chain = options.chain || parseData.defaultChain || 'eth';
    const config = parseData.apiConfig.find(i => i.chain === chain);
    if (!config) {
      console.log('You have not config this chain. Please refer to ""')
      process.exit(0)
    }
    return {
      apikey: config.apikey,
      url: config.url,
    }
  } catch (e) {
    console.log('No config file. Please uses `npx @wiw-io/vsopen-install` to generate a config file')
    process.exit(0)
  }
  return {
    url: '',
    apikey: '',
    chain: '',
  }
}