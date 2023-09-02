const path = require('path')
const chokidar = require('chokidar')
const chalk = require('chalk')
const { execSync, fork } = require('child_process')

let server = ''

function runServer() {
  const modulePath = path.resolve(__dirname, 'server.js')
  server = fork(modulePath)
}

function watch() {
  chokidar
    .watch(path.resolve(process.cwd(), 'lib'))
    .on('change', () => {
      console.log(chalk.red(`lib files is change，ready restart server`)) // 文件改变日志

      server.kill() // 杀进程
 
      execSync('npm run dev', { stdio: 'inherit' }) // 重新启动
    })
}

function start() {
  runServer() // 启动服务
  watch() // 监听文件变化
}

module.exports = {
  start
}