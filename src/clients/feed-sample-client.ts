import { Injectable } from 'injection-js';
import { EveClient } from './eve-client';
import { Environment } from '../bootstrapping/environment';

export interface ApiFeedSampleParams {
    url: string;
    encoding?: string;
    timeout?: number;
}

export interface ApiFeedSample {
    feedSample: string;
    elementNames: string[];
    itemNameSuggestion: string;
}

export interface ApiFeedSampleDataParams extends ApiFeedSampleParams {
    itemName: string;
}

export interface ApiFeedValidationParams {
    type: 'STOCK' | 'PRICE' | 'BARCODE';
    values: string[];
}

export interface ApiFeedValidationResult {
    value: string;
    parsedValue: string;
    status: 'success' | 'error';
}

@Injectable()
export class FeedSampleClient extends EveClient {
    constructor(protected env: Environment) {
        super(env);
        this.baseUrl = this.env.PRODUCT_SERVICE_URL;
    }

    async getSample(query: ApiFeedSampleParams): Promise<ApiFeedSample> {
        const response = await this.got.get('/feed/sample', { query });
        return response.body;
    }

    async getSampleData(query: ApiFeedSampleDataParams): Promise<{ path: string; values: string[] }[]> {
        const response = await this.got.get('/feed/sample-data', { query });
        return response.body.sampleData;
    }

    async validateFeed(field: ApiFeedValidationParams): Promise<ApiFeedValidationResult[]> {
        const response = await this.got.post('/feed/validate', { body: field });
        return response.body.results;
    }
}
