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

    async getPricing(marketplace: MarketplaceName, asin: string, sellerId: string = null) {
        let response = await this.got.get(`/marketplace/${marketplace}/asin/${asin}`, {
            body: {
                sellerId,
            },
        });
        if (response.statusCode == 204)
            return null;
        return response.body;
    }

    async getBuyBoxWinners() {
        let response = await this.got.get('/buyBoxWinners', {
            body: [],
        });
        return response.body
    }
}
