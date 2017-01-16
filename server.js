/**
 * Created by congchen on 1/16/17.
 */
const Koa = require('koa');
const Router = require('koa-router');

const app = new Koa();
const router = new Router();

const QQ = require('./QQ');
const Xiami = require('./Xiami');

router.get('/', async (ctx, next) => {

    ctx.body = await QQ.search("爱要怎么说出口");

});

router.get('/xiami', async (ctx, next) => {
    let query = ctx.request.query;
    ctx.body = await Xiami.search(query.keyword);
});

router.get('/qq', async (ctx, next) => {
    let query = ctx.request.query;
    ctx.body = await QQ.search(query.keyword);
});



app.use(router.routes())
    .use(router.allowedMethods());


app.listen(3000);
