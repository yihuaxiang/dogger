import Router from 'koa-router';

const router = new Router();
router.prefix('/user');
router.get('/getinfo', (ctx, next) => {
  ctx.body = 'goods/getinfo'
})
export default router;

