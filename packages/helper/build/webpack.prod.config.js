const webpackBaseConfig = require('./webpack.base.config.js')
const { merge } = require('webpack-merge')
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

const smp = new SpeedMeasurePlugin()

module.exports = smp.wrap(
	merge(webpackBaseConfig, {
		devtool: false,
		mode: "production",
		plugins: [
			new BundleAnalyzerPlugin({ analyzerMode: process.env.MEASURE || 'disabled'})
		]
	})
)