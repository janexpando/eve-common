import { Injectable } from 'injection-js';
import { Environment } from '../bootstrapping/environment';
import { EveClient } from './eve-client';
import { ObjectId } from 'bson';

export type ApiFeedType = 'GOOGLE_PRODUCT' | 'SHOPIFY' | 'SHOPTET' | 'CUSTOM' | 'DATABASE';

export interface ApiCompany {
    _id: string;
    name: string;
    feedType: ApiFeedType;
    active: boolean;
    blocked: boolean;
}

export interface ApiSellerId {
    _id: string;
    mwsCredentials: IMwsCredential[];
    mwsMarketplaces: ICompanyMwsMarketplace[];
}

export interface IMwsCredential {
    marketplaceId: string;
    sellerId: string;
}

export interface ICompanyMwsMarketplace {
    status: MarketplaceStatus;
    marketplaceId: string;
}

export type MarketplaceStatus = 'online' | 'offline' | 'error';

@Injectable()
export class CompanyClient extends EveClient {
    constructor(protected env: Environment) {
        super(env);
        this.baseUrl = this.env.COMPANY_SERVICE_URL;
    }

    async getCompanies(): Promise<ApiCompany[]> {
        let response = await this.got.get(`/company`);
        return response.body;
    }

    async getCompanyById(companyId: ObjectId): Promise<ApiCompany> {
        let response = await this.got.get(`/company/${companyId}`);
        return response.body;
    }

    async getSellerIds(companyId: ObjectId): Promise<ApiSellerId> {
        let response = await this.got.get(`/company/${companyId}/sellerIds`);
        return response.body;
    }
}
