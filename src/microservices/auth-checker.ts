import { Middleware } from 'koa';
import compose = require('koa-compose');
import bearerToken = require('koa-bearer-token');
import bodyParser = require('koa-bodyparser');
import { Environment } from '..';
import { Injectable } from 'injection-js';

@Injectable()
export class AuthChecker {
    constructor(protected env: Environment) {}

    check(): Middleware {
        return compose([
            bodyParser(),
            bearerToken(),
            async (context, next) => {
                let token = (context.request as any).token;
                if (token === this.env.EVE_AUTH_BEARER) {
                    return await next();
                } else {
                    context.body = 'Unauthorized microservice';
                    context.status = 401;
                }
            },
        ]);
    }
}
