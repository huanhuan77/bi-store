const webpack = require('webpack');
const publicPath = process.env.NODE_ENV === 'production' ? '/biStore/' : '/';
module.exports = {
  // 内网穿透
  devServer: {
    host: '0.0.0.0',
    hot: true,
    disableHostCheck: true, // 解决无效的头部信息
    // port: 8081,
  },
  publicPath,
  lintOnSave: false,
  css: {
    loaderOptions: {
      // 设置 scss 公用变量文件
      sass: {
        prependData: '@import \'~@/assets/style/public.scss\';',
      },
    },
  },
  configureWebpack: {
    plugins: [
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'windows.jQuery': 'jquery',
      }),
    ],
  },
};
