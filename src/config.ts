import prompts from "prompts";
import { cyan, red } from 'kolorist'
import { IConfigOptions, IConfig } from "./types";
import { writeConfig, getAllConfig, isHasConfigFile, deleteConfigFile } from './utils'
import shell from 'shelljs'

type ConfigType = 'api' | 'chain'

function setDefaultChain(chain: string) {
  const config = getAllConfig();
  config.defaultChain = chain
  writeConfig(config)
  console.log(`Successfully set default chain to ${chain}`)
  console.log(`Use 'vsopen get <address>' will automaticly use ${chain}`)
  process.exit(0)
}

export async function configChain(options: IConfigOptions) {
  if (options.reset) {
    deleteConfigFile();
    console.log('Config file has been deleted')
    process.exit(0)
  }
  const hasConfigFile = isHasConfigFile();
  let config: IConfig = {
    defaultChain: '',
    apiConfig: [],
  }
  if (hasConfigFile) {
    config = getAllConfig();
    if (config.apiConfig.some(i => i.chain === options.defaultChain)) {
      setDefaultChain(options.defaultChain as string)
    }
    if (options.defaultChain) {
      // set chain which not exist in api config
      console.log('Invalid default chain')
      process.exit(1);
    }
    console.log('Refer on README.md')
  }

  let result: prompts.Answers<'type' | 'chain' | 'url' | 'apikey' | 'isCancel'>
  try {
    result = await prompts(
      [
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
          type: (type: ConfigType) => type === 'api' ? 'text' : null,
          name: 'chain',
          message: cyan('Input which chain to config api, such as `bsc`'),
        },
        {
          type: (type: ConfigType) => type === 'chain' ? 'select' : null,
          name: 'chain',
          message: cyan('Set default chain'),
          initial: config.apiConfig.findIndex(i => i.chain === config.defaultChain),
          choices: config.apiConfig.map(i => ({
            title: i.chain,
            value: i.chain,
          }))
        },
        {
          type: (_, selection) => {
            if (selection.type === 'api' && config.apiConfig.some(i => i.chain === selection.chain)) {
              const configBefore = config.apiConfig.find(i => i.chain === selection.chain)
              console.log(`Chain: ${configBefore!.chain}`)
              console.log(`Url: ${configBefore!.url}`)
              console.log(`Apikey: ${configBefore!.apikey}`)
              return 'select'
            }
            return null;
          },
          name: 'isCancel',
          message: cyan('Current chain has been configured before, are you sure to overwrite the config above?'),
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
      ],
      {
        onCancel: () => {
          throw new Error(red('✖') + ' Operation cancelled')
        }
      }
    )
  } catch (cancelled: any) {
    console.log(cancelled.message)
    return
  }
  if (result.type === 'chain') {
    setDefaultChain(result.chain)
  }
  if (result.isCancel) {
    console.log('No change applied')
    process.exit(0)
  }
  const configChain = config.apiConfig.find(i => i.chain === result.chain)
  if (configChain) {
    configChain.apikey = result.apikey
    configChain.url = result.url
  } else {
    config.apiConfig.push({
      chain: result.chain,
      apikey: result.apikey,
      url: result.url
    })
    if (!config.defaultChain) {
      config.defaultChain = result.chain
    }
  }
  writeConfig(config)
  console.log(`Successfully configured ${result.chain}`);
  console.log(`Use 'vsopen get <address> -c ${result.chain}' to get contract source code`)
}

