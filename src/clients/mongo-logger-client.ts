import { Injectable } from 'injection-js';
import { ObjectId } from 'bson';
import {Environment} from "../bootstrapping/environment";
import {EveClient} from "./eve-client";

@Injectable()
export class MongoLoggerClient extends EveClient {
    constructor(protected env: Environment) {
        super(env);
        this.baseUrl = this.env.PRODUCT_SERVICE_URL;
    }

    async getLastSynced(companyId: ObjectId): Promise<Date> {
        const url = `/company/${companyId}/log/last-synced`;
        let response = await this.got.get(url);
        let lastSynced = response.body && response.body.lastSynced;
        if(!lastSynced) return lastSynced;
        return new Date(lastSynced);
    }
}
