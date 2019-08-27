const Koa = require('koa');
const Router = require('koa-router');
const logger = require('koa-logger');
const json = require('koa-json')

const app = new Koa();

app.use(logger());
app.use(json())

const router = new Router();

let connected = false;

function makeResp() {
    if (connected) {
        return { user: { name: "John Kowalski" } };
    } else {
        return { user: null };
    }
}

router.get('/api/service/connect', (ctx, next) => {
    ctx.body = makeResp();
});

router.post('/api/service/connect', (ctx, next) => {
    connected = true;
    ctx.body = makeResp();
});

router.delete('/api/service/connect', (ctx, next) => {
    connected = false;
    ctx.body = makeResp();
});

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(5000);
