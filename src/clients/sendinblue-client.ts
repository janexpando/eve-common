import { Injectable } from 'injection-js';
import { Environment } from '../bootstrapping/environment';
import got = require('got');
import { GotInstance, GotJSONFn } from "../../node_modules/got/source";

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
        cc?: string[];
        bcc?: string[];
    }): Promise<got.Response<any>> {
        const body: any = {
            emailTo: [options.email],
        };
        if (options.cc) {
            body.emailCc = options.cc;
        }
        if (options.bcc) {
            body.emailBcc = options.bcc;
        }
        if (options.attributes && Object.keys(options.attributes).length > 0) {
            body.attributes = options.attributes;
        }
        return this.got.post(`/smtp/templates/${options.templateId}/send`, {
            body,
        });
    }
}
