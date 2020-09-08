const path = require('path');

console.log(__dirname);
module.exports = {
	target: 'web',
	devtool: 'source-map',
	entry: './index.js',
	mode: 'development',
	output: {
		path: path.resolve(__dirname, 'www'),
		filename: 'bundle.js',
		publicPath: ''
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				include: [
					path.resolve(__dirname, 'src')
				],
				loader: 'babel-loader',
				query: {
					compact: true,
					presets: [
						['es2015', {modules: false}]
					]
				}
			}
		]
	}
};
