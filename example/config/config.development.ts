export default app => {
  return {
    // 配置
    devServer: {
      port: 8888
    },

    // 路由类型 file | koa-router
    // router: 'file'
    router: 'koa-router',

    // koa-static 配置 
    static: {

    }
  }
}
