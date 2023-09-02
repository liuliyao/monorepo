#!/usr/bin/env node
const { program } = require('commander')
const chalk = require('chalk')
const inquirer = require('inquirer')
const checkDirName = require('../lib/checkDirName')
const createTemplate = require('../lib/createTemplate')
const pkg = require('../package.json')

let AppName = ''; // 项目名称
let templateName = ''; // 创建模板名称

(async () => {
  program
    .name('im-cli-service')
    .description('cli create vue/react template')
    .version(pkg.version, '-v, --version')

  program
    .command('create')
    .description('create a new project powered by im-cli-service')
    .argument('<app-name>')
    .action(async (arg) => {

      if (checkDirName(arg)) {
        console.log(chalk.red('项目名称已存在'))
        process.exit(1)
      }
      AppName = arg // 项目名称

      console.log(chalk.blue(`${pkg.name} v${pkg.version}`))

      //选择创建模板
      const template = await inquirer.prompt({
        type: 'list',
        choices: ['Vue', 'React'],
        name: 'name',
        message: '请选择创建模板'
      })
      templateName = template.name.toLocaleLowerCase()

      // 创建模板
      createTemplate(AppName, templateName)

    })

  program.parse()
})()