import { Injectable } from 'injection-js';
import got = require('got');
import { GotInstance, GotJSONFn} from "got";
import {Environment} from "../bootstrapping/environment";

/**
 * Documentation: https://github.com/sendinblue/APIv3-nodejs-library#documentation-for-api-endpoints
 */
@Injectable()
export class SendinblueClient {
    protected baseUrl: string = 'https://api.sendinblue.com/v3/';

    constructor(private env: Environment) {}

    get got(): GotInstance<GotJSONFn> {
        return got.extend({
            baseUrl: this.baseUrl,
            json: true,
            headers: {
                'api-key': this.env.SENDINBLUE_TOKEN,
                'content-type': 'application/json',
            },
        });
    }

    sendTemplate(options: {
        templateId: number;
        attributes?: object;
        email: string;
    }): Promise<got.Response<any>> {
        const body: any = {
            emailTo: [options.email],
        };
        if (options.attributes && Object.keys(options.attributes).length > 0) {
            body.attributes = options.attributes;
        }
        return this.got.post(`/smtp/templates/${options.templateId}/send`, {
            body,
        });
    }
}