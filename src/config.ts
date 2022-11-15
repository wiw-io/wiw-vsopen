import prompts from "prompts";
import { cyan, green } from 'kolorist'
import { installAlias } from "./installAlias";

export async function configChain(...args: any[]) {
  installAlias();
  console.log(args)
  let result: prompts.Answers<'name'>
  try {
    result = await prompts([
      {
        type: 'text',
        name: 'name',
        message: cyan('Name?'),
        onState: (state) => {
          console.log(state)
        }
      }
    ])
  } catch (e) {
    console.log(e)
  }
}

// https://github.com/vitejs/vite/blob/main/packages/create-vite/src/index.ts