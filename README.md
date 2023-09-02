# monorepo
多包管理项目

## 常用命令
- lerna init: 初始化一个lerna项目
- lerna bootstrap: 安装所有packages的依赖项并且连接本地包的交叉依赖项
- lerna create: 创建一个lerna管理的package包
- lerna add [pkg] --scope=[package-name]: 将本地或者远程的包作为依赖项添加到当前的packages中(本地包添加的时候，lerna命令会通过symlink的方式关联过去，可以理解为创建了一个快捷方式，这个对本地开发非常有用。)
- lerna clean --scope=[package-name]: 删除所有包下面的node_modules目录，也可以删除指定包下面的node_modules
- lerna ls: 列出所有公开的包（排除private=true的）
- lerna changed: 检查自上次发布以来有哪些包有更新
- lerna diff: 查看自上次发布以来的所有包或者指定包的git diff变化
- lerna run [<script>]: 在包含该脚本命令的每个package内部执行npm script脚本命令,也可以指定在某个package下执行
- lerna exec xxx: 在每个包中执行任意命令，也可以指定在某个package下执行
- lerna link: 将相互依赖的所有包Symlink链接在一起(单独软链某个<package>: lerna exec --scope=@sfe/service npm link)
- lerna version: 相关版本信息
- lerna publish: 发布需要发布的包
- lerna bootstrap --hoist: 如果安装包里面有多个基础依赖包，可以使用 —hoist 方式来提升安装性能(提升到根目录)
- lerna publish --dist-tag dist: 某些发布的情况，开发者需要指定安装包版本，或者指定子目录发布。(指定dist目录为发布目录)