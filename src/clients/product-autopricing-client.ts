import { Injectable } from 'injection-js';
import { ObjectId } from 'bson';
import { Environment } from '..';
import { EveClient } from './eve-client';
import { MarketplaceName } from '..';

export interface ApiProductAutopricing {
    companyId: ObjectId;
    marketplace: MarketplaceName;
    sku: string;
    active?: boolean;
    lastActivated?: Date;
    lastDeactivated?: Date;

    current?: number;
    currentShipping?: number;
    otherLowest?: number;
    otherLowestShipping?: number;

    penalty?: number;
    autoprice?: number;
    selling?: number;
    lastUpdated?: Date;
    buybox?: boolean;
    highestInBuybox?: number;
    lowestNonBuybox?: number;
    topCap?: number;
    bottomCap?: number;
    forceUpdate?: boolean;
}

@Injectable()
export class ProductAutopricingClient extends EveClient {
    constructor(protected env: Environment) {
        super(env);
        this.baseUrl = this.env.PRODUCT_SERVICE_URL;
    }

    async get(companyId: ObjectId, marketplace: MarketplaceName, skus: string[]): Promise<ApiProductAutopricing[]> {
        const url = `/company/${companyId}/marketplace/${marketplace}/product-autopricing`;
        let response = await this.got.get(url, { body: { skus } });
        let items = response.body as ApiProductAutopricing[];
        if (items && items.length > 0) {
            items.forEach(x => {
                x.companyId = new ObjectId(x.companyId);
                if (x.lastUpdated) x.lastUpdated = new Date(x.lastUpdated);
                if (x.lastActivated) x.lastActivated = new Date(x.lastActivated);
                if (x.lastDeactivated) x.lastDeactivated = new Date(x.lastDeactivated);
            });
        }
        return items;
    }

    /**
     * Update product autopricing settings from frontend (FE > gateway > product service).
     */
    async setActiveState(companyId: ObjectId, marketplace: MarketplaceName, skus: string[], active: boolean) {
        const url = `/company/${companyId}/marketplace/${marketplace}/product-autopricing/active`;
        return this.got.post(url, { body: { skus, active } });
    }

    async setCaps(
        companyId: ObjectId,
        marketplace: MarketplaceName,
        skus: string[],
        topCap: number,
        bottomCap: number,
    ) {
        const url = `/company/${companyId}/marketplace/${marketplace}/product-autopricing/caps`;
        await this.got.patch(url, { body: { skus, topCap, bottomCap } });
    }
}
