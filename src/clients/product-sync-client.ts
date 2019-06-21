import {Injectable} from 'injection-js';
import {ObjectId} from 'bson';
import {Environment, EveClient} from "..";
import * as got from "got";

export interface ApiProductSync {
    interval: number;
    startedOn: Date;
    finishedOn: Date;
    isSyncing: boolean;
    feedDownloadStartedOn: Date;
    feedDownloadFinishedOn: Date;
    isFeedSyncing: boolean;
}

@Injectable()
export class ProductSyncClient extends EveClient {
    constructor(protected env: Environment) {
        super(env);
        this.baseUrl = this.env.PRODUCT_SERVICE_URL;
    }

    async getProductSync(companyId: ObjectId): Promise<ApiProductSync> {
        let response: got.Response<any> = await this.got.get(
            `/company/${companyId.toHexString()}/product-sync`,
        );
        if (!response.body) return null;
        return {
            interval: response.body.interval,
            startedOn: new Date(response.body.startedOn),
            finishedOn:
                response.body.finishedOn && new Date(response.body.finishedOn),
            isSyncing: response.body.isSyncing,
            feedDownloadStartedOn: new Date(
                response.body.feedDownloadStartedOn,
            ),
            feedDownloadFinishedOn:
                response.body.feedDownloadFinishedOn &&
                new Date(response.body.feedDownloadFinishedOn),
            isFeedSyncing: response.body.isFeedSyncing,
        };
    }


}
