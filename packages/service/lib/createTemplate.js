const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')
const chalk = require('chalk')

module.exports = function (appName, templateName) {
  console.log(chalk.blue('🗃  Invoking generators...'))

  //拷贝模版
  fs.cpSync(path.resolve(__dirname, `../template/${templateName}`), path.resolve(process.cwd(), `${appName}`), { recursive: true })

  // 修改工作目录为${appName}
  process.chdir(path.resolve(process.cwd(), `${appName}`))

  console.log(chalk.blue('📦 Installing additional dependencies...'))

  // 安装依赖
  execSync(`npm install`, { stdio: 'inherit' }) // 用于将子进程的输入/输出与父进程进行交互，以便在控制台中显示npm install的输出信息

  console.log(chalk.green('📦  Project create successful'))

  process.exit(0)
}