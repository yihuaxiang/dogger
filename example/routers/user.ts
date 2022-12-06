import Router from 'koa-router';

const router = new Router();

router.prefix('/user');
router.get('/getinfo', (ctx, next) => {
  ctx.body = 'user/getinfo'
})

export default router;

