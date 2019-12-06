import {ObjectId} from 'bson';
import {Injectable} from 'injection-js';
import {AmazonType} from "../models/marketplace-names";
import {Environment} from "../bootstrapping/environment";
import {EveClient} from "./eve-client";
import {IMwsCredentials} from "./product-pricing-client";

export interface ApiReturn {
    companyId: ObjectId;
    returnDate: Date;
    marketplaceOrderId: string;
    sku: string;
    asin: string;
    fnSku: string;
    productName: string;
    quantity: number;
    fulfillmentCenterId: string;
    detailedDisposition: string;
    reason: string;
    status: string;
    licensePlateNumber: string;
    customerComments: string;
}

@Injectable()
export class ReturnClient extends EveClient {

    constructor(protected env: Environment) {
        super(env);
    }

    async downloadReturns(
        companyId: ObjectId,
        marketplace: AmazonType,
        credentials: IMwsCredentials,
        callback: string,
        from: Date,
        to?: Date,
    ) {
        let body: any = {
            marketplace,
            credentials,
            callback,
            from,
        };

        if (to)
            body.to = to;

        await this.got.post(`${this.env.ORDER_DOWNLOADER_URL}/company/${companyId}/returns/download`, {
            body,
        });
    }
}
