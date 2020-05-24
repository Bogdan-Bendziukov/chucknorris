//запуск вебпака - npm run build

const path = require('path');

module.exports = {
  entry: './js/chuck.js',
  output: {
    path: path.resolve(__dirname, 'dist'), 
    filename: 'bundle.js',
    publicPath: './dist/'
  },
  module: {
	rules: [
		{
			test: /\.css$/,
			use: [
				'style-loader',
				'css-loader'
			]
		},
		{
			test: /\.less$/,
			use: [
			  {
				loader: 'style-loader',
			  },
			  {
				loader: 'css-loader',
			  },
			  {
				loader: 'less-loader',
				options: {
				  lessOptions: {
					strictMath: true,
				  },
				},
			  },
			],
		},
		{
         	test: /\.(png|svg|jpg|gif)$/,
         	use: [
				'file-loader',
         	],
		},
		{
			test: /\.(woff|woff2|eot|ttf|otf)$/,
			use: [
				'file-loader',
         	],		
		}
	]
  },
  watch: true
};