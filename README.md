# VSOPEN 

VSOPEN is a commandline tool that can be used to download smart contract sourcecode 
from Blockchain explorers like [Etherscan](https://etherscan.io/), and further set it up as project in
[VSCode](https://code.visualstudio.com/download) IDE.

## Prerequisite
- **Node.Js**. You need to have [Node](https://nodejs.org/en/) and [NPM](https://nodejs.org/en/) installed on your system to use this tool. It
 is recommended to have Node version greater than v16.
    ```
    $ node --version
      v16.14.2
    ```

- **API key**. Blockchain explorers will require user to register API keys to access their API. For example,
 you can get your Etherscan API key from [this link](https://etherscan.io/apis).

- (Optional) **VSCode**. If you want to import downloaded source code into VSCode, you may download
 and install the IDE from its [official release](https://code.visualstudio.com/download). Here are some basic configurations
 for VSCode:
  - [Install 'code' command](https://code.visualstudio.com/docs/setup/mac) into your PATH.
  - Install the 'solidity' language extension for VSCode.

## Usage
1. Installation.
   ```
   $ npm install -g wiw-vsopen@latest
   ```

2. Configure your API key.
    ```
    $ vsopen config
    ```
    Example config for Ethereum mainnet:
    ```
    {
      "chain": "eth"
      "apikey": "YOUR_API_KEY"
      "url": "https://api.etherscan.io/api"
    }
   ```
   API url for blockchain explorers:
   ```
   eth-mainnet: https://api.etherscan.io/api
   polygon-mainnet: https://api.polygonscan.com/api
   bnb-mainnet: https://api.bscscan.com/api
   ```

3. Download source code for verified smart contract.
   ```
   $ vsopen get <contract_address> -c <chain>
   ```

4. (Optional) If 'code' command was installed, VSOPEN will open VSCode with downloaded source code automatically.
