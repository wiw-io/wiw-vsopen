import shell from 'shelljs'

export const installAlias = () => {
  if (!shell.grep('vsopen','~/.bashrc').stdout.startsWith('alias vsopen')) {
    shell.exec('echo "alias vsopen=\'npx -y -p wiw-vsopen2@latest vsopen\'" >> ~/.bashrc')
  }
  if (!shell.grep('vsopen','~/.zshrc').stdout.startsWith('alias vsopen')) {
    shell.exec('echo "alias vsopen=\'npx -y -p wiw-vsopen2@latest vsopen\'" >> ~/.zshrc')
  }
}