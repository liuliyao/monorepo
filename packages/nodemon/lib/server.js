const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');
const connectHistoryApiFallback = require('connect-history-api-fallback');
const bodyParser = require('body-parser');
const chalk = require('chalk');
const { getPort } = require('./getPort');


  (async () => {
    app.use('/', connectHistoryApiFallback())

    app.use(cors())  // 处理跨域问题

    app.use(express.static(path.resolve(process.cwd(), 'public'))) // 设置默认静态资源目录

    app.use(bodyParser.json()) // 处理请求前，先解析json

    const port = await getPort()

    app.listen(port, () => {
      console.log(chalk.blue(`监听端口: ${port} 启动成功`))
    })

  })()
