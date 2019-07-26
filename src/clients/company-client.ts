import {Injectable} from "injection-js";
import {Environment} from "../bootstrapping/environment";
import {EveClient} from "./eve-client";
import {ObjectId} from "bson";


export type ApiFeedType = 'GOOGLE_PRODUCT' | 'SHOPIFY' | 'SHOPTET' | 'CUSTOM';

export interface ApiCompany {
    _id: string;
    name: string;
    feedType: ApiFeedType;
    feedUrl: string;
    active: boolean;
}

export interface ApiSellerId {
    _id: string;
    mwsCredentials: IMwsCredential[]
}

export interface IMwsCredential {
    marketplaceId: string;
    developerId: string;
    sellerId: string;
    token: string;
}

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

    async getSellerIds(): Promise<ApiSellerId[]> {
        let response = await this.got.get(`/sellerId`);
        return response.body;
    }
}