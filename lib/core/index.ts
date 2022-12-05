import Koa from 'koa';
import path from 'path';
import { getHooks, deepMerge } from './utils';
import { Hook, App } from './types';

const hooks = ['lift'];

type Params = {
  appPath: string;
}

export default async function Dogger(params: Params) {
  const app: App = (new Koa()) as App;
  const appPath = params.appPath;


  // 获取所有配置
  const env = process.env.NODE_ENV;
  const extName = app.extName = 'development' ? '.ts' : '.js';
  const baseConfig = await import(path.join(appPath, `config/config.base${extName}`));
  const curConfig = await import(path.join(appPath, `config/config.${env}${extName}`));
  app.config = deepMerge(baseConfig.default(app), curConfig.default(app));
  app.appPath = appPath;


  // 获取所有 hooks 逻辑
  const allHooks: Hook[] = await getHooks(hooks);
  for(const hook of allHooks) {
    try {
      await hook.default(app);
    } catch(error) {
      // TODO
    }
  }

  app.on('error', error => {
    // TODO
  })
}

