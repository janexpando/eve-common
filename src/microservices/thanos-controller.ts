import { Injectable } from 'injection-js';
import { Middleware } from 'koa';
import { ObjectId } from 'bson';
import {AuthChecker} from "./auth-checker";
import createRouter = require('koa-joi-router');
import {Thanos} from "./thanos";

@Injectable()
export class ThanosController {
    constructor(
        private authChecker: AuthChecker,
        private thanos: Thanos
    ) {
    }

    middleware(): Middleware {
        const router = createRouter();
        router.use(this.authChecker.check());
        router.route({
            method: 'POST',
            path: '/thanos/snap',
            handler: async ctx => {
                let companyId = new ObjectId(ctx.request.body.companyId);
                let isGateway = ctx.request.body.isGateway;
                await this.thanos.snap(companyId, isGateway);
                ctx.body = {};
                ctx.status = 200;
            },
        });

        return router.middleware();
    }
}