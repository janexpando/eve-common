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
    marketplace: AmazonType;
    fromLastUpdate: Date;
}

@Injectable()
export class OrderDownloaderClient extends EveClient {

    constructor(protected env: Environment,
                private mwsCredentialsKeeper: MwsCredentialsClient,
                private developerConfigKeeper: DeveloperConfigClient,
                private logger: ConsoleLogger) {
        super(env);
    }

    async downloadOrders(
        companyId: ObjectId,
        marketplace: AmazonType,
        fromLastUpdate: Date,
    ) {
        let { developerId, token, sellerId } = await this.mwsCredentialsKeeper.getCredentials(companyId, marketplace);
        let { accessKey, secretKey } = await this.developerConfigKeeper.getMwsConfig(developerId);
        this.logger.json({
            companyId,
            marketplace,
            fromLastUpdate,
            message: 'Requesting order downloader',
        });
        await this.got.post(`${this.env.ORDER_DOWNLOADER_URL}/company/${companyId}/orders/download`, {
            body: {
                marketplace,
                fromLastUpdate,
                credentials: {
                    sellerId,
                    token,
                    accessKey,
                    secretKey,
                },
                callback: `${this.env.SERVICE_URL}/company/${companyId}/orders`,
            } as OrdersDownloadBody,
        });
    }
}
