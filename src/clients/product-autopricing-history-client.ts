import {Injectable} from 'injection-js';
import {ObjectId} from 'bson';
import {Environment} from "../bootstrapping/environment";
import {EveClient} from "./eve-client";
import {MarketplaceName} from "..";

export interface ApiProductAutopricingHistory {
    companyId: ObjectId;
    marketplace: MarketplaceName;
    sku: string;

    active?: boolean;
    current?: number;
    currentShipping?: number;
    otherLowest?: number;
    otherLowestShipping?: number;
    autoprice?: number;
    selling?: number;
    buybox?: boolean;

    isListingUpdate: boolean,
    date: Date;
}

@Injectable()
export class ProductAutopricingHistoryClient extends EveClient {
    constructor(protected env: Environment) {
        super(env);
        this.baseUrl = this.env.PRODUCT_SERVICE_URL;
    }

    async get(companyId: ObjectId, marketplace: MarketplaceName, sku: string, before?: Date, after?: Date, isListingUpdate?: boolean): Promise<ApiProductAutopricingHistory[]> {
        const url = `/company/${companyId}/marketplace/${marketplace}/sku/${encodeURIComponent(sku)}/product-autopricing-history`;
        let response = await this.got.get(url, {body: {before, after ,isListingUpdate}});
        let items = response.body as ApiProductAutopricingHistory[];
        if (items && (items.length > 0)) {
            items.forEach(x => {
                x.companyId = new ObjectId(x.companyId);
                if (x.date) x.date = new Date(x.date);
            });
        }
        return items;
    }
}
