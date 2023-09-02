const path = require('path')
const fs = require('fs')

module.exports = function (appName) {
  return fs.existsSync(path.resolve(process.cwd(), `../${appName}`)) // 判断文件夹是否存在
}