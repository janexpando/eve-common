import { Injectable } from 'injection-js';
import { ObjectId } from 'bson';
import {Environment, EveClient} from "..";

@Injectable()
export class BlacklistClient extends EveClient {
    protected constructor(protected env: Environment) {
        super(env);
        this.baseUrl = this.env.PRODUCT_SERVICE_URL;
    }

    async getForbidListings(companyId: ObjectId, sku: string) {
        const url = `/company/${companyId}/blacklist/${encodeURIComponent(sku)}`;
        let response = await this.got.get(url);
        return response.body;
    }
}
