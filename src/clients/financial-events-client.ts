import { ObjectId } from 'bson';
import {Environment} from "..";
import {EveClient} from "./eve-client";
import {DeveloperConfigClient} from "./developer-config-client";
import {MwsCredentialsClient} from "./mws-credentials-client";
import {AmazonType} from "..";
import {ConsoleLogger} from "..";
import {Injectable} from "injection-js";

interface IMwsCredentials {
    accessKey: string;
    secretKey: string;
    sellerId: string;
    token: string;
}

interface FinancialEventsDownloadBody {
    credentials: IMwsCredentials;
    callback: string;
    marketplace: AmazonType;
    fromDate: Date;
}

@Injectable()
export class FinancialEventsClient extends EveClient{
    constructor(protected env: Environment,
                private mwsCredentialsKeeper: MwsCredentialsClient,
                private developerConfigKeeper: DeveloperConfigClient,
                private logger: ConsoleLogger) {
        super(env);
        this.baseUrl = this.env.ORDER_DOWNLOADER_URL;
    }

    async downloadFinancialEvents(
        companyId: ObjectId,
        marketplace: AmazonType,
        fromDate: Date,
    ) {
        let { developerId, token, sellerId } = await this.mwsCredentialsKeeper.getCredentials(companyId, marketplace);
        let { accessKey, secretKey } = await this.developerConfigKeeper.getMwsConfig(developerId);
        this.logger.json({
            companyId,
            marketplace,
            fromDate,
            message: 'Requesting financial events downloader',
        });
        await this.got.post(`/company/${companyId}/finances/financial-events`, {
            body: {
                marketplace,
                fromDate,
                credentials: {
                    sellerId,
                    token,
                    accessKey,
                    secretKey,
                },
                callback: `${this.env.SERVICE_URL}/company/${companyId}/finances/financial-events`,
            } as FinancialEventsDownloadBody,
        });
    }
}
