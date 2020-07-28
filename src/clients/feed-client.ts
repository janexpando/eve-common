import { Injectable } from 'injection-js';
import { ObjectId } from 'bson';
import { Environment } from '../bootstrapping/environment';
import { EveClient } from './eve-client';

export const FEED_SETUP_STATES = ['NoFeed', 'ItemSelection', 'Mapping', 'Done'] as const;
export type FeedSetupState = typeof FEED_SETUP_STATES[number];

export const FEED_STATUSES = [
    'Ok',
    'NoData',
    'UrlUnreachable',
    'BadMapping',
    'BadItem',
    'PossibleBadItem',
    'Timeout',
    'Unauthorized',
    'NoProducts',
    'IncorrectData',
    'ErrorWhileDownloading',
] as const;
export type FeedStatus = typeof FEED_STATUSES[number];

export const VALIDATION_FIELD_TYPES = ['STOCK', 'PRICE', 'BARCODE', 'SKU'];
export type ValidationFieldType = typeof VALIDATION_FIELD_TYPES[number];

export interface ApiInputFeed {
    feedUrl: string;
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

export interface ApiFeed extends ApiInputFeed {
    companyId: ObjectId;
    setupState: FeedSetupState;
    status: FeedStatus;
    feedSample?: string;
    elementNames?: string[];
    pathValues?: {
        path: string;
        values: string[];
    }[];
}

export interface ApiFeedValidationParams {
    type: ValidationFieldType;
    values: string[];
}

export interface ApiFeedValidationResult {
    value: string;
    parsedValue: string;
    status: 'success' | 'error';
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

    async set(companyId: ObjectId, payload: ApiInputFeed): Promise<ApiFeed> {
        const url = FeedClient.getUrl(companyId);
        const response = await this.got.put(url, { body: payload });
        return response.body;
    }

    async get(companyId: ObjectId, excludeSampleData: boolean = false): Promise<ApiFeed> {
        const url = FeedClient.getUrl(companyId);
        const response = await this.got.get(url, { query: { excludeSampleData } });
        return response.body;
    }

    async validateFeed(field: ApiFeedValidationParams): Promise<ApiFeedValidationResult[]> {
        const response = await this.got.post('/feed/validate', { body: field });
        return response.body.results;
    }
}
