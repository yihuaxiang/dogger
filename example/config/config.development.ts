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

    },

    cors: {
      origin: 'https://z.wiki',
      maxAge: 0
    },

    middlewares: ['two', 'one'],
    login: {
      needLogin: true,
      secret: 'dEo38V'
    },

    view: {
      extension: 'ejs'
    }
  }
}
