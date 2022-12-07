import Router from 'koa-router';

const router = new Router();
router.prefix('/user');
router.get('/getinfo', async (ctx, next) => {
  const user = ctx.user;
  ctx.body = 'user/getinfo ' + user?.username;
  await next();
})

export default router;

