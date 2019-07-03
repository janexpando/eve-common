import {Injectable} from 'injection-js';
import {ObjectId} from 'bson';
import {Environment} from "../bootstrapping/environment";
import {EveClient} from "./eve-client";
import {MarketplaceName} from "..";

export interface ApiProductStats {
    companyId: ObjectId;
    marketplace: MarketplaceName;
    ok: number;
    paused: number;
    notFound: number;
    error: number;
    missingBarcode: number;
}

@Injectable()
export class ProductStatsClient extends EveClient {
    constructor(protected env: Environment) {
        super(env);
        this.baseUrl = this.env.PRODUCT_SERVICE_URL;
    }

    async get(companyId: ObjectId, marketplace: MarketplaceName): Promise<ApiProductStats> {
        const url = `/company/${companyId}/marketplace/${marketplace}/product-stats`;
        let response = await this.got.get(url);
        return response.body;
    }
}
