#!/usr/bin/env node

import shell from 'shelljs'
import { install } from "./install";


if (shell.exec('command -v vsopen').code === 0) {
  console.log('vsopen already installed, config api url and key')
} else {
  shell.exec(install)
  console.log("vsopen installed, open another terminal and use 'vsopen -h' to get details.")
}


