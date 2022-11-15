export interface IGetOptions {
  path?: string;
  chain?: string;
  name?: string;
}

export interface IConfigOptions {
  defaultChain?: string;
  chain?: string;
  reset?: boolean;
}

interface IContractResult {
  ABI: string;
  CompilerVersion: string;
  ConstructorArguments: string;
  ContractName: string;
  EVMVersion: string;
  Implementation: string;
  Library: string;
  LicenseType: string;
  OptimizationUsed: string;
  Proxy: '0' | '1';
  Runs: string;
  SourceCode: string;
  SwarmSource: string;
}

interface IGetSourceCodeProps {
  url: string;
  address: string;
  apikey: string;
}

export type IApiResponse = {
  status: string;
  message: string;
  result: IContractResult[]  | 'string'
}

export interface IConfig {
  defaultChain: string;
  apiConfig: {
    chain: string;
    url: string;
    apikey: string;
  }[]
}

