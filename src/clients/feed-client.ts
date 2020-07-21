import { Injectable } from 'injection-js';
import { ObjectId } from 'bson';
import { Environment } from '../bootstrapping/environment';
import { EveClient } from './eve-client';

export interface ApiFeed {
    feedUrl?: string;
    decompress?: boolean;
    encoding?: string;
    item?: string;
    mapping?: {
        [key: string]: string;
    };
    auth?: string;
    js?: string;
    useCommaDelimiter?: true;
    anyDecimal?: true;
}

@Injectable()
export class FeedClient extends EveClient {
    constructor(protected env: Environment) {
        super(env);
        this.baseUrl = this.env.PRODUCT_SERVICE_URL;
    }

    private static getUrl(companyId: ObjectId): string {
        return `/company/${companyId.toHexString()}/feed`;
    }

    async setFeed(companyId: ObjectId, payload: ApiFeed): Promise<ApiFeed> {
        const url = FeedClient.getUrl(companyId);
        const response = await this.got.put(url, { body: payload });
        return response.body.feed;
    }

    async getFeed(companyId: ObjectId): Promise<ApiFeed> {
        const url = FeedClient.getUrl(companyId);
        const response = await this.got.get(url);
        return response.body.feed;
    }
}
