import {Injectable} from "injection-js";
import {Environment} from "../bootstrapping/environment";
import {EveClient} from "./eve-client";
import {ObjectId} from "bson";
import {MarketplaceName} from "../models/marketplace-names";

export type ApiMarketplaceStatus = 'online' | 'offline' | 'error';

export interface ApiMarketplace {
    marketplaceId: string;
    name: MarketplaceName;
    status: ApiMarketplaceStatus
}

export interface ApiListingStatistics {
    ok: number;
    error: number
}

@Injectable()
export class MarketplaceClient extends EveClient {
    constructor(protected env: Environment) {
        super(env);
        this.baseUrl = this.env.COMPANY_SERVICE_URL;
    }

    async getAllMarketplaces(companyId: ObjectId): Promise<ApiMarketplace[]> {
        let response = await this.got.get(`/company/${companyId}/marketplace`);
        return response.body;
    }

    async getMarketplace(companyId: ObjectId, name: MarketplaceName): Promise<ApiMarketplace> {
        let response = await this.got.get(`/company/${companyId}/marketplace/${name}`);
        return response.body;
    }

    async updateCurrentListingStatistics(companyId: ObjectId, name: MarketplaceName, statistics: ApiListingStatistics): Promise<{success: boolean}> {
        let response = await this.got.put(`/company/${companyId}/marketplace/${name}/listing-statistics/current`,{
            body: statistics
        });
        return response.body;

    }
}
