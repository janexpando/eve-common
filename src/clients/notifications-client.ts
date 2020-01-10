import {EveClient} from "./eve-client";
import {Environment} from "..";
import {ObjectId} from "bson";
import {Injectable} from "injection-js";

@Injectable()
export class NotificationsClient extends EveClient {
    constructor(env: Environment) {
        super(env);
        this.baseUrl = this.env.GATEWAY_URL
    }

    async notifySuspendedAmazonMarketplace(companyId: ObjectId) {
        const response = await this.got.post(`/notification/suspended-account`, {
            body: {
                companyId
            },
            json: true
        });

        return response.body;
    }
}