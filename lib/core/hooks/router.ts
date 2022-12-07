import glob from 'glob';
import path from 'path';
import compose from 'koa-compose';

export default async (app) => {
  const router = app.config.router;
  const filesList = glob.sync(path.resolve(app.appPath, './controller', `**/*${app.extName}`))

  if(router === 'file') {
    let routerMap = {};
    for(let item of filesList) {
      const controller = await import(item);
      const {method, handler} = controller.default;
      const relative = path.relative(`${app.appPath}/controller/`, item);
      const extname = path.extname(item);
      const fileRouter = '/' + relative.split(extname)[0];
      const key = '_' + method + '_' + fileRouter;

      routerMap[key] = handler;
    }

    app.use(async (ctx, next) => {
      const {path, method} = ctx;
      const key = '_' + method + '_' + path;

      if(routerMap[key]) {
        await routerMap[key](ctx);
      } else {
        await ctx.render('404');
        // ctx.body = 'no this router';
      }
      return next();
    })
  } else if(router == 'koa-router') {
    const routerFiles = glob.sync(path.resolve(app.appPath, './routers', `**/*${app.extName}`));
    const registerRouter = async () => {
      let routers: any[] = [];
      for (let file of routerFiles) {
        const router = await import(file);
        routers.push(router.default.routes());
      }
      return compose(routers)
    }
    app.use(await registerRouter())
  }
}
