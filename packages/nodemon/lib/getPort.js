const detect = require('detect-port')
const chalk = require('chalk')

let PORT = 8080


async function getPort() {
  const port = await detect(PORT)

  if (port !== PORT) {
    console.log(chalk.red(`端口: ${8080}已占用，修改启动端口为: ${port}`))
  }

  return port
}

module.exports = {
  getPort
}