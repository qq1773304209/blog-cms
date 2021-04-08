module.exports = {
	devServer: {
		host: "localhost",  //指定要使用的 host
		port: 8081,   //指定端口号以侦听
		hotOnly: false, //启用热模块替换，而无需页面刷新作为构建失败时的回退。
	},
	publicPath: process.env.NODE_ENV === 'production'
		? './'
		: '/',
	configureWebpack: {
		resolve: {
			alias: {
				'assets': '@/assets',
				'common': '@/common',
				'components': '@/components',
				'api': '@/api',
				'views': '@/views',
				'plugins': '@/plugins'
			}
		}
	}
}