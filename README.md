# VSOPEN 

VSOPEN is a command tool that can download contract sourcecode from etherscan (and so on) and automatically open vscode around it.

## Usage
You need to prepare something first.

### Nodejs > 16
https://nodejs.org/en/

### VSCode
https://code.visualstudio.com/

Install and open vscode.
Press command + shift + P
Type "alias code command" and choose the first option.

### Chain API
https://etherscan.io/apis

Get Api Key at https://etherscan.io/myapikey

## Step

`npx -y -p wiw-vsopen2@latest vsopen`

Open a new terminal

`vsopen config`

`vsopen get 0xxxxxxxx -c eth`


## F&Q

#### Invalid url

Check if config url is right.

Url should be like https://api.etherscan.io/api

#### No reaction when downloading

Check your network.

`ping api.etherscan.io`
