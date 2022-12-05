import Router from 'koa-router';

const router = new Router()
router.prefix('/goods')
router.get('/getinfo', async (ctx, next)=>{
    ctx.body = "this is koa book."
    await next();
})
export default router;
