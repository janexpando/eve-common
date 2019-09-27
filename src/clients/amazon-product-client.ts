import {Injectable} from 'injection-js';
import {ObjectId} from 'bson';
import {Environment} from "../bootstrapping/environment";
import {EveClient} from "./eve-client";
import {MarketplaceName} from "..";

@Injectable()
export class AmazonProductClient extends EveClient {
    constructor(protected env: Environment) {
        super(env);
        this.baseUrl = this.env.PRODUCT_SERVICE_URL;
    }

    async getAllAsins(companyId: ObjectId, marketplace: MarketplaceName) {
        const url = `/company/${companyId}/marketplace/${marketplace}/amazon-product/asins`;
        let response = await this.got.get(url, {body: {}});
        return response.body;
    }
}
