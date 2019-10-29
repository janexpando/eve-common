import {Injectable} from 'injection-js';
import {ObjectId} from 'bson';
import {Environment} from "../bootstrapping/environment";
import {EveClient} from "./eve-client";
import {MarketplaceName} from "..";

export interface ApiProductAutopricing {
    companyId: ObjectId;
    marketplace: MarketplaceName;
    sku: string;
    active?: boolean;

    current?: number;
    currentShipping?: number;
    otherLowest?: number;
    otherLowestShipping?: number;

    penalty?: number;
    autoprice?: number;
    lastUpdated?: Date;
    buybox?: boolean;
    highestInBuybox?: number;
    lowestNonBuybox?: number;
}

@Injectable()
export class ProductAutopricingClient extends EveClient {
    constructor(protected env: Environment) {
        super(env);
        this.baseUrl = this.env.PRODUCT_SERVICE_URL;
    }

    async get(companyId: ObjectId, marketplace: MarketplaceName, skus: string[]): Promise<ApiProductAutopricing[]> {
        const url = `/company/${companyId}/marketplace/${marketplace}/product-autopricing`;
        let response = await this.got.get(url, {body: {skus}});
        if (response.body && response.body.length > 0) {
            response.body.forEach(x => {
                x.companyId = new ObjectId(x.companyId);
                if (x.lastUpdated)
                    x.lastUpdated = new Date(x.lastUpdated);
            });
        }
        return response.body;
    }
}
