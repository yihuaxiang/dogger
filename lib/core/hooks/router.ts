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
        ctx.body = 'no this router';
      }
      return next();
    })
  } else if(router == 'koa-router') {
    console.log("router == 'koa-router'")
    const routerFiles = glob.sync(path.resolve(app.appPath, './routers', `**/*${app.extName}`));
    console.log('routerFiles', routerFiles)
    const registerRouter = async () => {
      let routers: any[] = [];
      for (let file of routerFiles) {
        console.log('file is', file);
        const router = await import(file);
        console.log('router is', router);
        routers.push(router.default.routes());
      }
      console.log('routers is', routers);
      return compose(routers)
    }
    app.use(await registerRouter())
  }
}
