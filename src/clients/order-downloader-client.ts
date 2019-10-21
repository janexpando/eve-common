import { ObjectId } from 'bson';
import { Injectable } from 'injection-js';
import {EveClient} from "./eve-client";
import {DeveloperConfigClient} from "./developer-config-client";
import {MwsCredentialsClient} from "./mws-credentials-client";
import {AmazonType} from "../models/marketplace-names";
import {Environment} from "../bootstrapping/environment";
import {ConsoleLogger} from "../logging/console-logger";

interface IMwsCredentials {
    accessKey: string;
    secretKey: string;
    sellerId: string;
    token: string;
}

interface OrdersDownloadBody {
    credentials: IMwsCredentials;
    callback: string;
    marketplaces: AmazonType[];
    fromLastUpdate: Date;
}

@Injectable()
export class OrderDownloaderClient extends EveClient {

    constructor(protected env: Environment,
                private logger: ConsoleLogger) {
        super(env);
    }

    async downloadOrders(
        companyId: ObjectId,
        marketplaces: AmazonType[],
        fromLastUpdate: Date,
        credentials: IMwsCredentials
    ) {
        this.logger.json({
            companyId,
            marketplaces,
            fromLastUpdate,
            message: 'Requesting order downloader',
        });
        await this.got.post(`${this.env.ORDER_DOWNLOADER_URL}/company/${companyId}/orders/download`, {
            body: {
                marketplaces,
                fromLastUpdate,
                credentials,
                callback: `${this.env.SERVICE_URL}/company/${companyId}/orders`,
            } as OrdersDownloadBody,
        });
    }
}
