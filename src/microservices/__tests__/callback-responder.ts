import {test} from "../../testing";
import {CallbackResponder} from "../callback-responder";
import {ConsoleLogger, Environment} from "../..";
import Application = require("koa");
import bodyparser = require('koa-bodyparser');

test('respond to callback url', async t => {
    let token = 'asdojfoi';
    let responder = new CallbackResponder(Environment.create({EVE_AUTH_BEARER: token}), new ConsoleLogger());
    t.plan(2);

    let app = new Application()
        .use(bodyparser())
        .use(ctx => {
            t.is(ctx.header.authorization, `Bearer ${token}`);
            t.deepEqual(ctx.request.body, {status: 'SUCCESS'});
            ctx.body = 'ok';
        });
    let server = app.listen();
    // @ts-ignore
    let port = server.address().port;
    try {
        await responder.run(`http://127.0.0.1:${port}/callback`, async () => {
            return {
                status: 'SUCCESS'
            };
        });
    } finally {
        server.close();
    }
});

test('respond with iterable', async t => {
    let token = 'asdojfoi';
    let responder = new CallbackResponder(Environment.create({EVE_AUTH_BEARER: token}), new ConsoleLogger());
    let indexes = [];
    let app = new Application()
        .use(bodyparser())
        .use(ctx => {
            t.is(ctx.header.authorization, `Bearer ${token}`);
            indexes.push(ctx.request.body.index);
            ctx.body = 'ok';
        });
    let server = app.listen();
    // @ts-ignore
    let port = server.address().port;
    try {
        async function* gen() {
            for (let i = 0; i < 5; i++) {
                yield {index: i};
            }
        }

        await responder.runIterable(`http://127.0.0.1:${port}/callback`, gen);
        t.deepEqual(indexes, [0, 1, 2, 3, 4]);
    } finally {
        server.close();
    }
});
