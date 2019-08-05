import {Injectable} from 'injection-js';
import {EveClient} from "./eve-client";
import {Environment} from "../bootstrapping/environment";
import {MarketplaceName} from "../models/marketplace-names";

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
}