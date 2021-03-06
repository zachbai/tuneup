const path = require('path');

const BUILD_DIR = path.resolve(__dirname, './client/dist');
const APP_DIR = path.resolve(__dirname, './client/');

const config = {
	entry: {
		main: APP_DIR + '/root.js'
	},
	devtool: 'inline-source-map',
	output: {
		filename: 'bundle.js',
		path: BUILD_DIR,
		publicPath: '/'
	},
	module: {
		rules: [
			{
				test: /(\.css|.scss)$/,
				use: [
					{
						loader: 'style-loader'
					},
					{
						loader: 'css-loader'
					},
					{
						loader: 'sass-loader'
					}]
			},
			{
				test: /\.(jsx|js)?$/,
				use: [{
					loader: 'babel-loader',
					options: {
						cacheDirectory: true,
						presets: ['react', 'env']
					}
				}]
			}
		]
	}
};

module.exports = config;
