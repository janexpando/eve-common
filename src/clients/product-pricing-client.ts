import {Injectable} from 'injection-js';
import {EveClient} from "./eve-client";
import {Environment} from "../bootstrapping/environment";
import {MarketplaceName} from "../models/marketplace-names";
import {ApiVariant} from "./product-service-client";
import {object, string} from "joi";

export interface ApiShallowPricing {
    found: boolean;
    isAlone: boolean;
    isCheaper: boolean;
    isPricier: boolean;
    isPricierWithinThreshold: boolean;
    freeShipping: boolean;
}

export interface IMwsCredentials {
    accessKey: string;
    secretKey: string;
    sellerId: string;
    token: string;
}

export const MwsCredentialsJoi = object({
    accessKey: string().required(),
    secretKey: string().required(),
    sellerId: string().required(),
    token: string().allow(null)
});

@Injectable()
export class ProductPricingClient extends EveClient {
    constructor(
        protected env: Environment,
    ) {
        super(env);
        this.baseUrl = this.env.PRICING_SERVICE_URL;
    }

    async getPricing(marketplace: MarketplaceName, asins: string[], sellerId: string = null) {
        let response = await this.got.get(`/marketplace/${marketplace}`, {
            body: {
                sellerId,
                asins
            },
        });
        if (response.statusCode == 204)
            return [];
        return response.body;
    }

    async getShallowPricing(marketplace: MarketplaceName, credentials: IMwsCredentials, variants: ApiVariant[]): Promise<ApiShallowPricing[]> {
        let response = await this.got.get(`/marketplace/${marketplace}/shallow-pricing`, {
            body: {
                variants: variants.map(x => {
                    return {
                        barcode: x.barcode,
                        price: x.prices[marketplace].selling
                    }
                }),
                credentials,
            },
        });
        if (response.statusCode == 204)
            return [];
        return response.body;
    }
}