module.exports = {
  // 生成环境不需要map文件
  productionSourceMap: !process.env.NODE_ENV === 'production',
  // 项目输出路径
  // outputDir: 'D:\\git\\server\\huhuiyu.top.server\\teach_project_ui',
  // 服务器虚拟路径
  publicPath: process.env.NODE_ENV === 'production' ? '/teach_project_ui/' : '/',
  configureWebpack: (config) => {
    if (process.env.NODE_ENV === 'production') {
      // 为生产环境修改配置...
      config.mode = 'production'
      config['performance'] = {
        //打包文件大小配置
        maxEntrypointSize: 1000000,
        maxAssetSize: 2000000,
      }
    }
  },
  devServer: {
    port: 40000,
  },
}
