import {Injectable} from "injection-js";
import {Environment} from "../bootstrapping/environment";
import {EveClient} from "./eve-client";
import {ObjectId} from "bson";
import {MarketplaceName} from "..";
import {number, object} from "joi";

export interface ApiShallowPricingReport {
    found: number;
    notFound: number;
    isAlone: number;
    isCheaper: number;
    isPricier: number;
    isPricierWithinThreshold: number;
    freeShipping: number;
}

export const ApiShallowPricingReportJoi = object({
    pricingReport: object({
        found: number(),
        notFound: number(),
        isAlone: number(),
        isCheaper: number(),
        isPricier: number(),
        isPricierWithinThreshold: number(),
        freeShipping: number()
    })
});

@Injectable()
export class PricingReportClient extends EveClient {
    constructor(protected env: Environment) {
        super(env);
        this.baseUrl = this.env.COMPANY_SERVICE_URL;
    }

    async sendShallowPricingReport(companyId: ObjectId, marketplace: MarketplaceName, pricingReport: ApiShallowPricingReport) {
        let response = await this.got.post(
            `/company/${companyId}/marketplace/${marketplace}/shallow-pricing-report`,
            {
                body: {
                    pricingReport
                }
            },
        );

        return response.body;
    }
}