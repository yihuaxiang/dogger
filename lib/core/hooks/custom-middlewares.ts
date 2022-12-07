import path from 'path';

export default async (app) => {
  const middlewares = app.config.middlewares;

  for(let m of middlewares) {
    const curMWPath = path.resolve(app.appPath, './middleware', `${m}${app.extName}`)
    const cMW = await import(curMWPath);
    app.use(cMW.default(app));
  }
}
