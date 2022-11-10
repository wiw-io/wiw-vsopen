#!/usr/bin/env node

import axios from 'axios'

axios.get('https://api.etherscan.io/api', {
  params: {
    module: 'contract',
    action: 'getsourcecode',
    address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
    apikey: 'MXRWWMCP2TJU8TERKEFR9HRXIBK96S4WXH'
  },
}).then(res => {
  console.log(res.data)
})