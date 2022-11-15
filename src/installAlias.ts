import child from 'child_process'

const script = `
if [[ $(alias vsopen) ]]
then
  exit 0
fi
if [[ $SHELL == '/bin/zsh' ]]
then
  echo "alias vsopen='npx -y @wiw-io/vsopen@latest'" >> ~/.zshrc
elif [[ $SHELL == '/bin/bash' ]]
then
  echo "alias vsopen='npx -y @wiw-io/vsopen@latest'" >> ~/.bashrc
fi
`

export const installAlias = () => {
  child.exec(script)
}

