const path = require('path')
const WebpackBar = require('webpackbar') // 显示打包进度
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
	entry: {
		app: path.resolve(__dirname, '../src/index'),
	},
	output: {
		path: path.resolve(__dirname, '../dist'),
		filename: 'index.cjs.js', // xxx.cjs.js(CommonJS); xxx.esm.js(ES Module)
		clean: true,
		library: {
			// type: 'umd' // UMD同时兼容 CommonJS 和 ES Modules，以及全局变量的使用
			type: 'commonjs'
			// type: 'module'
		}
	},
	// experiments: {
	//   outputModule: true,
	// },
	module: {
		rules: [
			{
				test: /\.(js|jsx|ts|tsx)$/,
				exclude: /node_modules/,
				loader: 'babel-loader',
				options: {
					cacheDirectory: true,
					presets: [
						'@babel/preset-env',
						'@babel/preset-react',
						'@babel/preset-typescript'
					] // 效果等同于.babelrc => presets: ['@babel/preset-env',	'@babel/preset-react','@babel/preset-typescript']
				},
				// loader: 'esbuild-loader', // 用Go语言编写，基于ESM，利用并发和多线程内存共享优势提升打包速度(vite 内部的构建基于esbuild)
				// options: {
				// 	target: 'es5'
				// },
			},
		]
	},
	plugins: [
		new CleanWebpackPlugin(),
		new WebpackBar(),
	],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, '../src'), // 同tsconfig.json => compilerOptions => paths 配置
			'src': path.resolve(__dirname, '../src'),
		},
		extensions: ['.js', '.jsx', '.ts', '.tsx'], // 自动识别文件后缀
	},
	cache: {
		type: 'filesystem'
	},
	optimization: {
		minimize: false, // 生产环境默认是压缩的
	}
}