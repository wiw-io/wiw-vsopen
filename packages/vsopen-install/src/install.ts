export const install = `
if [[ $SHELL == '/bin/zsh' ]]
then
  echo "alias vsopen='npx -y @wiw-io/vsopen'" >> ~/.zshrc
elif [[ $SHELL == '/bin/bash' ]]
then
  echo "alias vsopen='npx -y @wiw-io/vsopen'" >> ~/.bashrc
fi
`